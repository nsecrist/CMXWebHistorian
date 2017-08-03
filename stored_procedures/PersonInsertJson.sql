DROP PROCEDURE IF EXISTS dbo.PersonInsertJson
GO
CREATE PROCEDURE dbo.PersonInsertJson(@json nvarchar(max))

AS BEGIN
	INSERT INTO Person (id, first_name, last_name, email, gender, ip_address)
	SELECT id, first_name, last_name, email, gender, ip_address
	FROM OPENJSON(@json)
		WITH (id int, first_name nvarchar(50), last_name nvarchar(50), email nvarchar(50), gender nvarchar(6), ip_address nvarchar(15))
END