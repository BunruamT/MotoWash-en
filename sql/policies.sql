-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY users_select ON users
  FOR SELECT
  USING (
    auth.uid() = id OR -- User can see their own data
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    ) -- Admins can see all users
  );

-- Create policies for vehicles
CREATE POLICY vehicles_select ON vehicles
  FOR SELECT
  USING (
    user_id = auth.uid() OR -- User can see their own vehicles
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    ) -- Admins can see all vehicles
  );

CREATE POLICY vehicles_insert ON vehicles
  FOR INSERT
  WITH CHECK (user_id = auth.uid()); -- Users can only add vehicles for themselves

CREATE POLICY vehicles_update ON vehicles
  FOR UPDATE
  USING (user_id = auth.uid()); -- Users can only update their own vehicles

-- Create policies for bookings
CREATE POLICY bookings_select ON bookings
  FOR SELECT
  USING (
    user_id = auth.uid() OR -- User can see their own bookings
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND (u.role = 'admin' OR u.role = 'runner')
    ) -- Admins and runners can see all bookings
  );

CREATE POLICY bookings_insert ON bookings
  FOR INSERT
  WITH CHECK (user_id = auth.uid()); -- Users can only create bookings for themselves

CREATE POLICY bookings_update ON bookings
  FOR UPDATE
  USING (
    user_id = auth.uid() OR -- User can update their own bookings
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    ) -- Admins can update any booking
  );

-- Create policies for jobs
CREATE POLICY jobs_select ON jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings AS b
      WHERE b.id = booking_id AND (
        b.user_id = auth.uid() OR -- User can see jobs for their bookings
        EXISTS (
          SELECT 1 FROM users AS u
          WHERE u.id = auth.uid() AND (u.role = 'admin' OR u.role = 'runner')
        ) -- Admins and runners can see all jobs
      )
    )
  );

-- Create policies for payments
CREATE POLICY payments_select ON payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings AS b
      WHERE b.id = booking_id AND (
        b.user_id = auth.uid() OR -- User can see payments for their bookings
        EXISTS (
          SELECT 1 FROM users AS u
          WHERE u.id = auth.uid() AND u.role = 'admin'
        ) -- Admins can see all payments
      )
    )
  );

-- Create policies for reviews
CREATE POLICY reviews_select ON reviews
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings AS b
      WHERE b.id = booking_id AND (
        b.user_id = auth.uid() OR -- User can see their own reviews
        EXISTS (
          SELECT 1 FROM users AS u
          WHERE u.id = auth.uid() AND u.role = 'admin'
        ) -- Admins can see all reviews
      )
    )
  );

CREATE POLICY reviews_insert ON reviews
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings AS b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    ) -- Users can only review their own bookings
  );
