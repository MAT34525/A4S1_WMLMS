import csv

# Colonnes pour chaque fichier
tracks_columns = ['id', 'name','artists', 'id_artists','duration_ms', 'explicit','release_date','time_signature']
audio_features_columns = ['id', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']

# Ouvrir le fichier source (tracks.csv renommé en tracks_i.csv) et créer les fichiers de destination
with open('tracks_i.csv', 'r', newline='', encoding='utf-8') as source_file, \
     open('tracks.csv', 'w', newline='', encoding='utf-8') as tracks_file, \
     open('tracks_features.csv', 'w', newline='', encoding='utf-8') as audio_features_file:

    reader = csv.DictReader(source_file)
    tracks_writer = csv.DictWriter(tracks_file, fieldnames=tracks_columns)
    audio_features_writer = csv.DictWriter(audio_features_file, fieldnames=audio_features_columns)

    # Écrire les en-têtes
    tracks_writer.writeheader()
    audio_features_writer.writeheader()

    # Traiter chaque ligne
    for row in reader:
        # Écrire dans le nouveau tracks.csv
        tracks_writer.writerow({col: row[col] for col in tracks_columns})
        
        # Écrire dans tracks_audio_features.csv
        audio_features_writer.writerow({col: row[col] for col in audio_features_columns})

print("Fichiers scindés avec succès.")