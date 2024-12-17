import csv

# Colonnes pour chaque fichier
tracks_columns = ['id', 'name','artists', 'id_artists','duration_ms', 'explicit','release_date','time_signature']
audio_features_columns = ['id', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']

# On ouvre le fichier source (tracks.csv renommé en tracks_i.csv) et on créé les fichiers de destination
with open('tracks_i.csv', 'r', newline='', encoding='utf-8') as source_file, \
     open('tracks.csv', 'w', newline='', encoding='utf-8') as tracks_file, \
     open('tracks_features.csv', 'w', newline='', encoding='utf-8') as audio_features_file:

    reader = csv.DictReader(source_file)
    tracks_writer = csv.DictWriter(tracks_file, fieldnames=tracks_columns)
    audio_features_writer = csv.DictWriter(audio_features_file, fieldnames=audio_features_columns)

    tracks_writer.writeheader() # les en-têtes
    audio_features_writer.writeheader()

    for row in reader: # Pour chaque ligne, on écrit dans le nouveau tracks.csv 
        tracks_writer.writerow({col: row[col] for col in tracks_columns})
        # ou dans tracks_audio_features.csv
        audio_features_writer.writerow({col: row[col] for col in audio_features_columns})

print("Fichiers scindés avec succès.")