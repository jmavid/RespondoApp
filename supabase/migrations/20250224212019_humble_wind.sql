/*
  # Create Report View

  1. New Views
    - Creates a comprehensive report view excluding created_by field
    - Maintains original field order and data formats
    - Includes proper joins for related data
*/

-- Create view for comprehensive reporting
CREATE OR REPLACE VIEW report_view AS
SELECT
  t.id,
  t.title,
  t.description,
  t.status,
  t.priority,
  t.category,
  t.source,
  t.created_at,
  t.updated_at,
  t.resolved_at,
  t.assigned_to,
  p.email as assigned_to_email,
  (
    SELECT COUNT(*)
    FROM ticket_comments tc
    WHERE tc.ticket_id = t.id
  ) as comment_count,
  (
    SELECT COUNT(*)
    FROM ticket_attachments ta
    WHERE ta.ticket_id = t.id
  ) as attachment_count,
  EXTRACT(EPOCH FROM (
    CASE
      WHEN t.status = 'resolved' THEN t.resolved_at
      ELSE NOW()
    END - t.created_at
  ))::integer as resolution_time_seconds,
  (
    SELECT STRING_AGG(field_name || ': ' || old_value || ' -> ' || new_value, '; ')
    FROM ticket_audit_log tal
    WHERE tal.ticket_id = t.id
    ORDER BY tal.changed_at
  ) as change_history
FROM
  tickets t
LEFT JOIN
  profiles p ON t.assigned_to = p.id
ORDER BY
  t.created_at DESC;

-- Create function to get report data with optional filters
CREATE OR REPLACE FUNCTION get_report_data(
  start_date TIMESTAMPTZ DEFAULT NULL,
  end_date TIMESTAMPTZ DEFAULT NULL,
  status_filter ticket_status DEFAULT NULL,
  priority_filter ticket_priority DEFAULT NULL,
  category_filter ticket_category DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  description TEXT,
  status ticket_status,
  priority ticket_priority,
  category ticket_category,
  source ticket_source,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  assigned_to UUID,
  assigned_to_email TEXT,
  comment_count BIGINT,
  attachment_count BIGINT,
  resolution_time_seconds INTEGER,
  change_history TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM report_view
  WHERE
    (start_date IS NULL OR created_at >= start_date) AND
    (end_date IS NULL OR created_at <= end_date) AND
    (status_filter IS NULL OR status = status_filter) AND
    (priority_filter IS NULL OR priority = priority_filter) AND
    (category_filter IS NULL OR category = category_filter);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;