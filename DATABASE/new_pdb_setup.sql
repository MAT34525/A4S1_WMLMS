-- This script is to setup a new PDB on oracle that will be used by the application
-- If you prefer to watch a video (please, make use of the variables below) : https://www.youtube.com/watch?v=C4_cIRs53Kk

-- Go to C:/app/<user>/product/21c/oradata/XE
-- Create a new folder named WMLMSPDB

-- Log in  the database as sys in the cdb$root container

-- Create the new pdb as follows (obvious security concern since the pwd is in clear text)
CREATE PLUGGABLE DATABASE wmlmwpdb ADMIN USER admin IDENTIFIED BY admin
       ROLES=(DBA)
       FILE_NAME_CONVERT = ('C:\app\ADMIN\product\21c\oradata\XE\pdbseed',
       'C:\app\ADMIN\product\21c\oradata\XE\WMLMSPDB');

-- Open database
ALTER PLUGGABLE DATABASE wmlmwpdb OPEN;

-- Move the newly created database
ALTER SESSION SET CONTAINER wmlmwpdb;

-- Setup the network configuration

-- Go to C:/app/<user>/product/21c using an admin privileged terminal
-- Run netca

-- In the utility :
    -- Select : Local Net Service Name configuration
    -- Select : Add
    -- Insert : wmlmwpdb
    -- Select : TCP
    -- Insert name : localhost
    -- Select : Change Login
        -- Insert username : admin
        -- Insert password : admin
   -- On <Ok> click,  you should see a successful test
   -- Insert (should already be inserted) : wmlmwpdb
   -- Finished !

-- Try the connection on SQLPlus :
-- sqlplus admin/admin@wmlmwpdb