-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, role, name)
VALUES (
  'admin@motowash.campus',
  '$2a$10$PxKqGZk3lAw1WWVyQp4NI.QXL5vV2Kq9xPqR6LJ6l6h6yRz7.tvlK',
  'admin',
  'Admin User'
);

-- Insert sample pickup points
INSERT INTO pickup_points (name, description)
VALUES
  ('Engineering Building', 'Main entrance of Engineering Building'),
  ('Science Complex', 'Parking area near Science Complex'),
  ('Library', 'Library front entrance'),
  ('Student Center', 'Student Center parking area');

-- Insert default business hours
INSERT INTO business_hours (day_of_week, open_time, close_time)
VALUES
  (0, '10:00', '16:00'), -- Sunday (shorter hours)
  (1, '09:00', '17:00'), -- Monday
  (2, '09:00', '17:00'), -- Tuesday
  (3, '09:00', '17:00'), -- Wednesday
  (4, '09:00', '17:00'), -- Thursday
  (5, '09:00', '17:00'), -- Friday
  (6, '10:00', '16:00'); -- Saturday (shorter hours)

-- Insert default capacity slots
WITH RECURSIVE hours AS (
  -- Base weekday times from 9:00 to 16:00
  SELECT '09:00'::TIME as hour
  UNION ALL
  SELECT (hour + interval '1 hour')::TIME
  FROM hours
  WHERE hour < '16:00'::TIME
), weekend_hours AS (
  -- Weekend times from 10:00 to 15:00
  SELECT '10:00'::TIME as hour
  UNION ALL
  SELECT (hour + interval '1 hour')::TIME
  FROM weekend_hours
  WHERE hour < '15:00'::TIME
), slots AS (
  -- Combine days and hours
  SELECT 
    d.day_of_week,
    CASE 
      WHEN d.day_of_week IN (0, 6) THEN wh.hour
      ELSE h.hour
    END as time_slot,
    CASE
      WHEN d.day_of_week IN (0, 6) THEN 2 -- reduced capacity on weekends
      ELSE 3
    END as max_bookings
  FROM generate_series(0, 6) d(day_of_week)
  LEFT JOIN hours h ON d.day_of_week NOT IN (0, 6)
  LEFT JOIN weekend_hours wh ON d.day_of_week IN (0, 6)
)
INSERT INTO capacity_slots (day_of_week, time_slot, max_bookings)
SELECT 
  day_of_week,
  time_slot,
  max_bookings
FROM slots
WHERE time_slot IS NOT NULL;
