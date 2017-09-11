DROP PROCEDURE IF EXISTS [dbo].[person_insert]
GO
CREATE PROCEDURE [dbo].[person_insert](@json NVARCHAR(MAX))
AS BEGIN

	INSERT INTO JCE_Personnel([PersonnelRole], [FirstName], [MiddleName], [LastName], [Suffix], [HireDate], [LocalJacobsBadgeID], [CRCode_FunctionCode], [EmployeeNumber], [OraclePartyID], [HRJobTitle], [LocalJobTitle], [Department], [Shift], [Skill], [Class], [CrewCode], [Status], [JacobsStartDate], [LocationStartDate], [LocationTermDate], [DateLastChange], [Company], [Phone])
	SELECT [PersonnelRole], [FirstName], [MiddleName], [LastName], [Suffix], [HireDate], [LocalJacobsBadgeID], [CRCode_FunctionCode], [EmployeeNumber], [OraclePartyID], [HRJobTitle], [LocalJobTitle], [Department], [Shift], [Skill], [Class], [CrewCode], [Status], [JacobsStartDate], [LocationStartDate], [LocationTermDate], [DateLastChange], [Company], [Phone]
	FROM OPENJSON(@json)
		WITH (
			 [PersonnelRole] varchar(10) 'strict $.personnelrole'
			,[FirstName] varchar(50) 'strict $.firstname'
			,[MiddleName] varchar(50) 'lax $.middlename'
			,[LastName] varchar(50) 'strict $.lastname'
			,[Suffix] varchar(20) 'lax $.suffix'
			,[HireDate] datetime 'lax $.hiredate'
			,[LocalJacobsBadgeID] varchar(20) 'lax $.localjacobsbadgeid'
			,[CRCode_FunctionCode] varchar(4) 'lax $.crcode_functioncode'
			,[EmployeeNumber] varchar(9) 'lax $.employeenumber'
			,[OraclePartyID] varchar(20) 'lax $.oraclepartyid'
			,[HRJobTitle] varchar(50) 'lax $.hrjobtitle'
			,[LocalJobTitle] varchar(50) 'lax $.localjobtitle'
			,[Department] varchar(50) 'lax $.department'
			,[Shift] varchar(2) 'lax $.shift'
			,[Skill] varchar(50) 'lax $.skill'
			,[Class] varchar(50) 'lax $.class'
			,[CrewCode] varchar(4) 'lax $.crewCode'
			,[Status] varchar(8) 'lax $.status'
			,[JacobsStartDate] datetime 'lax $.jacobsstartdate'
			,[LocationStartDate] datetime 'lax $.locationstartdate'
			,[LocationTermDate] datetime 'lax $.locationtermdate'
			,[DateLastChange] datetime 'lax $.datelastchange'
			,[Company] varchar(50) 'lax $.company'
			,[Phone] varchar(20) 'lax $.phone')
END
