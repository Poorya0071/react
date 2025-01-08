INSERT INTO customers (
    first_name, last_name, email, phone, address1, address2, city, state, zip, country, active, created_at, updated_at
)
VALUES
    ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St', 'Apt 4B', 'New York', 'NY', '10001', 'US', true, now(), now()),
    ('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210', '456 Oak St', NULL, 'Los Angeles', 'CA', '90001', 'US', true, now(), now()),
    ('Alice', 'Johnson', 'alice.johnson@example.com', '555-123-4567', '789 Pine St', 'Suite 100', 'Chicago', 'IL', '60601', 'US', true, now(), now()),
    ('Bob', 'Brown', 'bob.brown@example.com', '444-555-6666', '321 Maple St', NULL, 'Houston', 'TX', '77001', 'US', true, now(), now()),
    ('Charlie', 'Davis', 'charlie.davis@example.com', '222-333-4444', '654 Elm St', 'Floor 2', 'San Francisco', 'CA', '94101', 'US', true, now(), now());
