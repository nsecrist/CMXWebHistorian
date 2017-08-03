/********************************************************************************************************************************************************
*
*			Function that generates CREATE PROCEDURE script that inserts JSON array into table.
*			Keys in JSON object must match columns in table. Use FOR JSON to generate JSON from table.
*			Author: Jovan Popovic
*
********************************************************************************************************************************************************/
GO
DROP FUNCTION IF EXISTS
dbo.GenerateJsonInsertProcedure
GO
CREATE FUNCTION
dbo.GenerateJsonInsertProcedure(@SchemaName sysname, @TableName sysname, @JsonColumns nvarchar(max), @IgnoredColumns nvarchar(max))
RETURNS NVARCHAR(MAX)
AS BEGIN
declare @JsonParam sysname = '@'+@TableName+'Json'
declare @JsonSchema nvarchar(max) = '';


with col_def(ColumnName, ColumnId, ColumnType, StringSize, Mode, IsJson) AS
(
	select 
		col.name as ColumnName,
		column_id ColumnId,
		typ.name as ColumnType,
		-- create type with size based on type name and size
		case typ.name
			when 'char' then '(' + cast(col.max_length as varchar(10))+ ')'
			when 'nchar' then '(' + cast(col.max_length as varchar(10))+ ')'
			when 'nvarchar' then (IIF(col.max_length=-1, '(MAX)', '(' + cast(col.max_length as varchar(10))+ ')'))
			when 'varbinary' then (IIF(col.max_length=-1, '(MAX)', '(' + cast(col.max_length as varchar(10))+ ')'))
			when 'varchar' then (IIF(col.max_length=-1, '(MAX)', '(' + cast(col.max_length as varchar(10))+ ')'))
			else ''
		end as StringSize,
		-- if column is not nullable, add Strict mode in JSON
		case 
			when col.is_nullable = 1 then '$.' else 'strict $.' 
		end Mode,
		CHARINDEX(col.name, @JsonColumns,0) as IsJson
	from sys.columns col
		join sys.types typ on
			col.system_type_id = typ.system_type_id AND col.user_type_id = typ.user_type_id
				LEFT JOIN dbo.syscomments SM ON col.default_object_id = SM.id  
	where object_id = object_id(QUOTENAME(@SchemaName) + '.' + QUOTENAME(@TableName))
	-- Do not insert identity, computed columns, hidden columns, rowguid columns, generated always columns 
	-- Skip columns that cannot be parsed by JSON, e.g. text, sql_variant, etc. 
	and col.is_identity = 0
	and col.is_computed = 0
	and col.is_hidden = 0
	and col.is_rowguidcol = 0
	and generated_always_type = 0
	and (sm.text IS NULL OR sm.text NOT LIKE '(NEXT VALUE FOR%')
	and LOWER(typ.name) NOT IN ('text', 'ntext', 'sql_variant', 'image','hierarchyid','geometry','geography')
	and col.name NOT IN (SELECT value FROM STRING_SPLIT(@IgnoredColumns, ','))
)
select @JsonSchema = @JsonSchema + '
			' + QUOTENAME(ColumnName) + ' ' + ColumnType + StringSize + 
			 ' N''' + Mode + '"' + STRING_ESCAPE(ColumnName, 'json') + '"''' +IIF(IsJson>0, ' AS JSON', '') + ',' 
from col_def
order by ColumnId

-- Generate list of column names ordered by columnid
declare @TableSchema nvarchar(max) = '';

with col_def(ColumnName, ColumnId, ColumnType, StringSize, Mode, IsJson) AS
(
    select 
        col.name as ColumnName,
        column_id ColumnId,
        typ.name as ColumnType,
		-- create type with size based on type name and size
		case typ.name
			when 'char' then '(' + cast(col.max_length as varchar(10))+ ')'
            when 'nchar' then '(' + cast(col.max_length as varchar(10))+ ')'
            when 'nvarchar' then (IIF(col.max_length=-1, '(MAX)', '(' + cast(col.max_length as varchar(10))+ ')'))
            when 'varbinary' then (IIF(col.max_length=-1, '(MAX)', '(' + cast(col.max_length as varchar(10))+ ')'))
            when 'varchar' then (IIF(col.max_length=-1, '(MAX)', '(' + cast(col.max_length as varchar(10))+ ')'))
			else ''
		end as StringSize,
		-- if column is not nullable, add Strict mode in JSON
        case 
            when col.is_nullable = 1 then '$.' else 'strict $.' 
        end Mode,
		CHARINDEX(col.name, @JsonColumns,0) as IsJson
    from sys.columns col
        join sys.types typ on
            col.system_type_id = typ.system_type_id AND col.user_type_id = typ.user_type_id
				LEFT JOIN dbo.syscomments SM ON col.default_object_id = SM.id  
    where object_id = object_id(QUOTENAME(@SchemaName) + '.' + QUOTENAME(@TableName))
	-- Do not insert identity, computed columns, hidden columns, rowguid columns, generated always columns 
	-- Skip columns that cannot be parsed by JSON, e.g. text, sql_variant, etc. 
	and col.is_identity = 0
	and col.is_computed = 0
	and col.is_hidden = 0
	and col.is_rowguidcol = 0
	and generated_always_type = 0
	and (sm.text IS NULL OR sm.text NOT LIKE '(NEXT VALUE FOR%')
	and LOWER(typ.name) NOT IN ('text', 'ntext', 'sql_variant', 'image','hierarchyid','geometry','geography')
	and col.name NOT IN (SELECT value FROM STRING_SPLIT(@IgnoredColumns, ','))
)
select @TableSchema = @TableSchema + QUOTENAME(ColumnName) + ',' 
from col_def
order by ColumnId

SET @TableSchema = SUBSTRING(@TableSchema, 0, LEN(@TableSchema)) --> remove last comma

declare @Result nvarchar(max) = 
N'DROP PROCEDURE IF EXISTS ' + QUOTENAME( @SchemaName) + '.' + QUOTENAME(@TableName + 'InsertJson') + '
GO
CREATE PROCEDURE ' + QUOTENAME( @SchemaName) + '.' + QUOTENAME(@TableName + 'InsertJson') + '(@' + @TableName + ' NVARCHAR(MAX))
AS BEGIN

	INSERT INTO ' + @TableName + '(' + @TableSchema + ')
	SELECT ' + @TableSchema + '
	FROM OPENJSON(' + @JsonParam + ')
		WITH (' + @JsonSchema + ')
END'

RETURN REPLACE(@Result,',)',')')
END

GO

/*
-- Setting parameters

declare @SchemaName sysname = 'Sales'		--> Name of the table where we want to insert JSON
declare @TableName sysname = 'Orders'		--> Name of the table schema where we want to insert JSON
declare @JsonColumns nvarchar(max) = '||'	--> List of pipe-separated NVARCHAR(MAX) column names that contain JSON text, e.g. '|AdditionalContactInfo|Demographics|' 
declare @IgnoredColumns nvarchar(max) = N'LastEditedBy,LastEditedWhen' --> List of comma-separated columns that should not be imported
print (dbo.GenerateJsonInsertProcedure(@SchemaName, @TableName, @JsonColumns, @IgnoredColumns))

declare @SchemaName sysname = 'Person'		--> Name of the table where we want to insert JSON
declare @TableName sysname = 'Address'		--> Name of the table schema where we want to insert JSON
declare @JsonColumns nvarchar(max) = '||'	--> List of pipe-separated NVARCHAR(MAX) column names that contain JSON text, e.g. '|AdditionalContactInfo|Demographics|' 
declare @IgnoredColumns nvarchar(max) = N'ModifiedDate' --> List of comma-separated columns that should not be imported
print (dbo.GenerateJsonInsertProcedure(@SchemaName, @TableName, @JsonColumns, @IgnoredColumns))


*/