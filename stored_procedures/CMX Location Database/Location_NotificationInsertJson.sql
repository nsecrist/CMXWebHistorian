USE [JCE]
GO
/****** Object:  StoredProcedure [dbo].[Location_NotificationInsertJson]    Script Date: 9/12/2017 8:03:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Location_NotificationInsertJson](@Location_NotificationJson NVARCHAR(MAX))
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
