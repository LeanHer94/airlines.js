CREATE OR REPLACE FUNCTION fn_planes_getby_id(p_id INT)
RETURNS TABLE (id INT, name VARCHAR) AS
$$
BEGIN
	RETURN QUERY
    SELECT a.id, a.model, a.seats FROM planes as a WHERE a.id = p_id;
END
$$ LANGUAGE plpgsql;