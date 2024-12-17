-- Chap1
-- To show a sample of data from a table
SELECT * FROM tracks WHERE ROWNUM <= 10;

SELECT * FROM artists WHERE ROWNUM <= 10;

SELECT * FROM tracks_audio_features WHERE ROWNUM <= 10;

SELECT * FROM users WHERE ROWNUM <= 10;

-- Chap2
-- To show users created in the pdb
SELECT username, account_status, created
FROM DBA_USERS
ORDER BY created DESC;

-- To see all the views created
SELECT view_name FROM user_views;

-- Chap3
-- window function for the artists having more than 1 million followers
SELECT name, followers, RANK() OVER (ORDER BY followers DESC) AS follower_rank
FROM artists
WHERE followers > 1000000;

-- analytic function AVG() to compute the average energy of the tracks per year
SELECT EXTRACT(YEAR FROM t.release_date) AS release_year, AVG(taf.energy) AS avg_energy
FROM tracks t
JOIN tracks_audio_features taf ON t.track_id = taf.track_id
GROUP BY EXTRACT(YEAR FROM t.release_date)
ORDER BY release_year DESC;

-- and then with the materialized view
SELECT * FROM mv_avg_energy_per_year ORDER BY release_year DESC;

-- Chap4
-- adding a user
INSERT INTO users (user_id, username, password, email, full_name)
VALUES (generate_uuid(), 'B.Curlu', 'userpassword88', 'mailuser2@exemple.com', 'Ohzman');

-- checking the logs
SELECT * FROM logs;
