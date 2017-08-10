DROP PROCEDURE IF EXISTS [dbo].[Location_NotificationInsertJson]
GO
CREATE PROCEDURE [dbo].[Location_NotificationInsertJson](@Location_NotificationJson NVARCHAR(MAX))
AS BEGIN

	INSERT INTO Location_Notification([subscriptionName],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[ssid],[band],[floorId],[entity],[deviceId],[lastSeen])
	SELECT [subscriptionName],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[ssid],[band],[floorId],[entity],[deviceId],[lastSeen]
	FROM OPENJSON(@Location_NotificationJson)
		WITH (
			[subscriptionName] nvarchar(256) 'lax $.subscriptionName',
			--[eventId] int 'lax $."eventId"',
			[locationMapHierarchy] nvarchar(256) 'lax $.locationMapHierarchy',
			[locationCoordinateX] float 'lax $.locationCoordinate.x',
			[locationCoordinateY] float 'lax $.locationCoordinate.y',
			[locationCoordinateZ] float 'lax $.locationCoordinate.z',
			[locationCoordinateUnit] nvarchar(64) 'lax $.locationCoordinate.unit',
<<<<<<< HEAD
			[geoCoordinateLat] float 'lax $.geoCoordinate.lattitude',
=======
<<<<<<< HEAD
			[geoCoordinateLat] float 'lax $.geoCoordinate."lattitude"',
=======
			[geoCoordinateLat] float 'lax $.geoCoordinate.lattitude',
>>>>>>> 084f6e7f64581a5ddefd74077b6bc70250148db9
>>>>>>> d7f995494c957c29628e24cf6349ecb819c67c43
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
			[lastSeen] varchar(128) '$.lastSeen')
			--[rawX] int '$.rawLocation."rawX"',
			--[rawY] int '$.rawLocation."rawY"',
			--[rawUnit] nvarchar(64) '$.rawLocation."unit"')
END
