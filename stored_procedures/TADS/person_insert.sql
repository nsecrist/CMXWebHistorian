DROP PROCEDURE IF EXISTS [dbo].[person_insert]
GO
CREATE PROCEDURE [dbo].[person_insert](@json NVARCHAR(MAX))
AS BEGIN

	INSERT INTO JCE_Personnel([PersonnelRole], [FirstName], [MiddleName], [LastName], [Suffix], [HireDate], [LocalJacobsBadgeID], [CRCode_FunctionCode], [EmployeeNumber], [OraclePartyID], [HRJobTitle], [LocalJobTitle], [Department], [Shift], [Skill], [Class], [CrewCode], [Status], [JacobsStartDate], [LocationStartDate], [LocationTermDate], [DateLastChange], [Company], [Phone])
	SELECT [PersonnelRole], [FirstName], [MiddleName], [LastName], [Suffix], [HireDate], [LocalJacobsBadgeID], [CRCode_FunctionCode], [EmployeeNumber], [OraclePartyID], [HRJobTitle], [LocalJobTitle], [Department], [Shift], [Skill], [Class], [CrewCode], [Status], [JacobsStartDate], [LocationStartDate], [LocationTermDate], [DateLastChange], [Company], [Phone]
	FROM OPENJSON(@json)
		WITH (
			 [PersonnelRole] varchar(10) '$.PersonnelRole'
			,[FirstName] varchar(50) '$.FirstName'
			,[MiddleName] varchar(50) 'lax $.MiddleName'
			,[LastName] varchar(50) '$.LastName'
			,[Suffix] varchar(20) 'lax $.Suffix'
			,[HireDate] datetime 'lax $.HireDate'
			,[LocalJacobsBadgeID] varchar(20) 'lax $.LocalJacobsBadgeID'
			,[CRCode_FunctionCode] varchar(4) 'lax $.CRCode_FunctionCode'
			,[EmployeeNumber] varchar(9) 'lax $.EmployeeNumber'
			,[OraclePartyID] varchar(20) 'lax $.OraclePartyID'
			,[HRJobTitle] varchar(50) 'lax $.HRJobTitle'
			,[LocalJobTitle] varchar(50) 'lax $.LocalJobTitle'
			,[Department] varchar(50) 'lax $.Department'
			,[Shift] varchar(2) 'lax $.Shift'
			,[Skill] varchar(50) 'lax $.Skill'
			,[Class] varchar(50) 'lax $.Class'
			,[CrewCode] varchar(4) 'lax $.CrewCode'
			,[Status] varchar(8) 'lax $.Status'
			,[JacobsStartDate] datetime 'lax $.JacobsStartDate'
			,[LocationStartDate] datetime 'lax $.LocationStartDate'
			,[LocationTermDate] datetime 'lax $.LocationTermDate'
			,[DateLastChange] datetime 'lax $.DateLastChange'
			,[Company] varchar(50) 'lax $.Company'
			,[Phone] varchar(20) 'lax $.Phone' )
END
