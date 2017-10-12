USE [JCE]
GO

-- Drop and create Location_CVT
DROP TABLE IF EXISTS [dbo].[Location_CVT]
GO

CREATE TABLE [dbo].[Location_CVT](
	[deviceId] [nchar](17) NOT NULL,
	[lastSeen] [varchar](128) NOT NULL,
	[locationMapHierarchy] [nvarchar](128) NOT NULL,
	[locationCoordinateX] [float] NOT NULL,
	[locationCoordinateY] [float] NOT NULL,
	[locationCoordinateUnit] [nvarchar](32) NOT NULL,
	[geoCoordinateLat] [float] NULL,
	[geoCoordinateLong] [float] NULL,
	[geoCoordinateUnit] [nvarchar](32) NULL,
	[JCE_PID] [int] NOT NULL,
 CONSTRAINT [PK_Location_CVT] PRIMARY KEY CLUSTERED
(
	[deviceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Drop and create Location_Notification
DROP TABLE IF EXISTS [dbo].[Location_Notification]
GO

CREATE TABLE [dbo].[Location_Notification](
	[subscriptionName] [nvarchar](128) NOT NULL,
	[JCE_PID] [int] NOT NULL,
	[eventId] [int] NULL,
	[locationMapHierarchy] [nvarchar](128) NOT NULL,
	[locationCoordinateX] [float] NOT NULL,
	[locationCoordinateY] [float] NOT NULL,
	[locationCoordinateZ] [float] NOT NULL,
	[locationCoordinateUnit] [nvarchar](32) NOT NULL,
	[geoCoordinateLat] [float] NULL,
	[geoCoordinateLong] [float] NULL,
	[geoCoordinateUnit] [nvarchar](32) NULL,
	[confidenceFactor] [int] NOT NULL,
	[apMacAddress] [nchar](17) NULL,
	[associated] [bit] NULL,
	[username] [nvarchar](50) NULL,
	[ipaddress] [nchar](10) NULL,
	[ssid] [nvarchar](32) NULL,
	[band] [nvarchar](32) NULL,
	[floorId] [nvarchar](128) NOT NULL,
	[floorRefId] [nvarchar](128) NULL,
	[entity] [nvarchar](32) NOT NULL,
	[deviceId] [nchar](17) NOT NULL,
	[lastSeen] [varchar](128) NOT NULL,
	[rawX] [int] NULL,
	[rawY] [int] NULL,
	[rawUnit] [nvarchar](32) NULL,
	[timestamp] [nchar](15) NULL,
	[notificationType] [nvarchar](128) NULL,
	[crewcode] varchar(4) NULL
) ON [PRIMARY]
GO

-- Drop and create Associate SP
DROP PROCEDURE IF EXISTS [dbo].[Associate]
GO

CREATE PROCEDURE [dbo].[Associate](@mac VARCHAR(12), @pid int, @date DateTime)
AS BEGIN

	INSERT INTO JCE_Assigned_Tags
	(MAC_Address, JCE_PID, DateAssigned)
	VALUES (@mac, @pid, @date)


	INSERT INTO JCE_Tag_MasterList
	(MAC_Address, Tag_Status, StatusDate)
	VALUES (@mac, 'ASSIGNED', @date)

END
GO

-- Drop and create person_insert SP
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

	DECLARE @tempId INT

	SELECT @tempId = MAX(JCE_PID) FROM JCE_Personnel

	SELECT *
	FROM JCE_Personnel
	WHERE JCE_PID = @tempId
	FOR JSON AUTO
END
GO

-- Drop and create associate SP
DROP PROCEDURE IF EXISTS [dbo].[Unassociate]
GO

CREATE PROCEDURE [dbo].[Unassociate](@mac VARCHAR(12), @date DateTime)
AS BEGIN

	UPDATE JCE_Assigned_Tags
	SET DateUnassigned = @date
	WHERE (DateUnassigned is NUll AND MAC_Address = @mac)


	INSERT INTO JCE_Tag_MasterList
	(MAC_Address, Tag_Status, StatusDate)
	VALUES (@mac, 'AVAILABLE', @date)

END
GO

-- Drop and create Location CVT Insert SP
DROP PROCEDURE IF EXISTS [dbo].[Location_CVT_Insert]
GO

CREATE PROCEDURE [dbo].[Location_CVT_Insert](@Location_NotificationJson NVARCHAR(MAX))
AS BEGIN

  MERGE INTO Location_CVT AS C
  USING
  (		SELECT
			deviceID, lastSeen, locationMapHierarchy, locationCoordinateX,
			locationCoordinateY, locationCoordinateUnit, geoCoordinateLat,
			geoCoordinateLong, geoCoordinateUnit, JCE_PID
		FROM
			OPENJSON(@Location_NotificationJson)
        WITH
		 (	[deviceId] nchar(34) 'strict $.deviceId',
			[lastSeen] varchar(128) '$.lastSeen',
			[locationMapHierarchy] nvarchar(256) 'lax $.locationMapHierarchy',
			[locationCoordinateX] float 'lax $.locationCoordinate.x',
			[locationCoordinateY] float 'lax $.locationCoordinate.y',
			[locationCoordinateZ] float 'lax $.locationCoordinate.z',
			[locationCoordinateUnit] nvarchar(64) 'lax $.locationCoordinate.unit',
			[geoCoordinateLat] float 'lax $.geoCoordinate.latitude',
			[geoCoordinateLong] float 'lax $.geoCoordinate.longitude',
			[geoCoordinateUnit] nvarchar(64) 'lax $.geoCoordinate.unit',
			[JCE_PID] int 'strict $.jce_pid'
		 ) AS InputJSON
  ) AS InputJSON
  ON (C.deviceId = InputJSON.deviceId)
    WHEN MATCHED THEN
      UPDATE
		SET C.lastSeen = InputJSON.lastSeen,
			C.locationMapHierarchy = InputJSON.locationMapHierarchy,
			C.locationCoordinateX = InputJSON.locationCoordinateX,
			C.locationCoordinateY = InputJSON.locationCoordinateY,
			C.locationCoordinateUnit = InputJSON.locationCoordinateUnit,
			C.geoCoordinateLat = InputJSON.geoCoordinateLat,
			C.geoCoordinateLong = InputJSON.geoCoordinateLong,
			C.geoCoordinateUnit = InputJSON.geoCoordinateUnit,
			C.JCE_PID = InputJSON.jce_pid
    WHEN NOT MATCHED THEN
      INSERT (deviceId, lastSeen, locationMapHierarchy, locationCoordinateX,
			  locationCoordinateY, locationCoordinateUnit, geoCoordinateLat,
			  geoCoordinateLong, geoCoordinateUnit, JCE_PID)
      VALUES (InputJSON.deviceId, InputJSON.lastSeen, InputJSON.locationMapHierarchy,
			  InputJSON.locationCoordinateX, InputJSON.locationCoordinateY,
              InputJSON.locationCoordinateUnit, InputJSON.geoCoordinateLat,
			  InputJSON.geoCoordinateLong, InputJSON.geoCoordinateUnit, InputJSON.jce_pid);
END
GO


-- Drop and create Location_Notification Insert SP
DROP PROCEDURE IF EXISTS [dbo].[Location_NotificationInsertJson]
GO

CREATE PROCEDURE [dbo].[Location_NotificationInsertJson](@Location_NotificationJson NVARCHAR(MAX))
AS BEGIN

	INSERT INTO Location_Notification([subscriptionName],[eventId],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateLat],[geoCoordinateLong],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[ssid],[band],[floorId],[entity],[deviceId],[lastSeen],[timestamp],[JCE_PID],[crewcode])
	SELECT [subscriptionName],[eventId],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateLat],[geoCoordinateLong],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[ssid],[band],[floorId],[entity],[deviceId],[lastSeen],[timestamp],[JCE_PID],[crewcode]
	FROM OPENJSON(@Location_NotificationJson)
		WITH (
			[subscriptionName] nvarchar(256) 'lax $.subscriptionName',
			[eventId] int 'lax $."eventId"',
			[locationMapHierarchy] nvarchar(256) 'lax $.locationMapHierarchy',
			[locationCoordinateX] float 'lax $.locationCoordinate.x',
			[locationCoordinateY] float 'lax $.locationCoordinate.y',
			[locationCoordinateZ] float 'lax $.locationCoordinate.z',
			[locationCoordinateUnit] nvarchar(64) 'lax $.locationCoordinate.unit',
			[geoCoordinateLat] float 'lax $.geoCoordinate.latitude',
			[geoCoordinateLong] float 'lax $.geoCoordinate.longitude',
			[geoCoordinateUnit] nvarchar(64) 'lax $.geoCoordinate.unit',
			[confidenceFactor] int 'lax $.confidenceFactor',
			[apMacAddress] nchar(34) '$.apMacAddress',
			--[associated] bit 'lax $."associated"',
			--[username] nvarchar(100) '$."username"',
			--[ipaddress] nchar(20) '$."ipaddress"',
			[ssid] nvarchar(64) '$.ssid',
			[band] nvarchar(64) '$.band',
			[floorId] nvarchar(256) 'lax $.floorId',
			--[floorRefId] nvarchar(256) 'lax $."floorRefId"',
			[entity] nvarchar(64) 'lax $.entity',
			[deviceId] nchar(34) 'lax $.deviceId',
			[lastSeen] varchar(128) '$.lastSeen',
			[timestamp] nchar(15) '$.timestamp',
			[JCE_PID] int 'strict $.jce_pid',
			[crewcode] varchar(4) 'lax $.crewcode')
			--[rawX] int '$.rawLocation."rawX"',
			--[rawY] int '$.rawLocation."rawY"',
			--[rawUnit] nvarchar(64) '$.rawLocation."unit"')
END
GO
