DROP PROCEDURE IF EXISTS [dbo].[Area_ChangeInsertJson]
GO
CREATE PROCEDURE [dbo].[Area_ChangeInsertJson](@Area_ChangeJson NVARCHAR(MAX))
AS BEGIN

	INSERT INTO Area_Change([notificationType],[subscriptionName],[entity],[deviceId],[lastSeen],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateLat],[geoCoordinateLong],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[ssid],[band],[floorId],[moveDistanceInFt],[timestamp])
	SELECT [notificationType],[subscriptionName],[entity],[deviceId],[lastSeen],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateLat],[geoCoordinateLong],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[ssid],[band],[floorId],[moveDistanceInFt],[timestamp]
	FROM OPENJSON(@Area_ChangeJson)
		WITH (
			[notificationType] nvarchar(256) 'lax $.notificationType',
			[subscriptionName] nvarchar(256) 'lax $.subscriptionName',
			[entity] nvarchar(64) 'lax $.entity',
			[deviceId] nchar(34) 'lax $.deviceId',
			[lastSeen] nvarchar(64) 'lax $.lastSeen',
			[locationMapHierarchy] nvarchar(128) 'lax $.locationMapHierarchy',
			[locationCoordinateX] float 'lax $.locationCoordinate.x',
			[locationCoordinateY] float 'lax $.locationCoordinate.y',
			[locationCoordinateZ] float 'lax $.locationCoordinate.z',
			[locationCoordinateUnit] nvarchar(64) 'lax $.locationCoordinate.unit',
			[geoCoordinateLat] float 'lax $.geoCoordinateLat',
			[geoCoordinateLong] float 'lax $.geoCoordinateLong',
			[geoCoordinateUnit] nvarchar(64) 'lax $.geoCoordinateUnit',
			[confidenceFactor] int 'lax $.confidenceFactor',
			[apMacAddress] nchar(34) 'lax $.apMacAddress',
			[ssid] nvarchar(256) 'lax $.ssid',
			[band] nvarchar(32) 'lax $.band',
			[floorId] nvarchar(64) 'lax $.floorId',
			[moveDistanceInFt] int 'lax $.moveDistanceInFt',
			[timestamp] varchar(32) 'lax $.timestamp')
END
