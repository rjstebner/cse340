-- Insert new records into the account table
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_type
  )
VALUES   (
    'Tony',
    'Stark',
    'tony@starknet.com',
    'Iam1ronm@n',
);

-- Update the account table
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete a record from the account table
DELETE FROM public.account
WHERE account_id = 1;

-- Modify GM HUMMER record
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Use an inner join to select the make, model, and classification name of all sport cars
SELECT 
    inventory.inv_make, 
    inventory.inv_model, 
    classification.classification_name
FROM 
    public.inventory
INNER JOIN 
    public.classification 
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';

-- Update the image paths
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');