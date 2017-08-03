DROP PROCEDURE IF EXISTS [dbo].[Location_NotificationInsertJson]
GO
CREATE PROCEDURE [dbo].[Location_NotificationInsertJson](@Location_NotificationJson NVARCHAR(MAX))
AS BEGIN

	INSERT INTO Location_Notification([subscriptionName],[eventId],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[associated],[username],[ipaddress],[ssid],[band],[floorId],[floorRefId],[entity],[deviceId],[lastSeen],[rawX],[rawY],[rawUnit])
	SELECT [subscriptionName],[eventId],[locationMapHierarchy],[locationCoordinateX],[locationCoordinateY],[locationCoordinateZ],[locationCoordinateUnit],[geoCoordinateUnit],[confidenceFactor],[apMacAddress],[associated],[username],[ipaddress],[ssid],[band],[floorId],[floorRefId],[entity],[deviceId],[lastSeen],[rawX],[rawY],[rawUnit]
	FROM OPENJSON(@Location_NotificationJson)
		WITH (
			[subscriptionName] nvarchar(256) N'strict $."subscriptionName"',
			[eventId] int N'strict $."eventId"',
			[locationMapHierarchy] nvarchar(256) N'strict $."locationMapHierarchy"',
			[locationCoordinateX] float N'strict $."locationCoordinateX"',
			[locationCoordinateY] float N'strict $."locationCoordinateY"',
			[locationCoordinateZ] float N'strict $."locationCoordinateZ"',
			[locationCoordinateUnit] nvarchar(64) N'strict $."locationCoordinateUnit"',
			[geoCoordinateUnit] nvarchar(64) N'strict $."geoCoordinateUnit"',
			[confidenceFactor] int N'strict $."confidenceFactor"',
			[apMacAddress] nchar(34) N'$."apMacAddress"',
			[associated] bit N'strict $."associated"',
			[username] nvarchar(100) N'$."username"',
			[ipaddress] nchar(20) N'$."ipaddress"',
			[ssid] nvarchar(64) N'$."ssid"',
			[band] nvarchar(64) N'$."band"',
			[floorId] nvarchar(256) N'strict $."floorId"',
			[floorRefId] nvarchar(256) N'strict $."floorRefId"',
			[entity] nvarchar(64) N'strict $."entity"',
			[deviceId] nchar(34) N'strict $."deviceId"',
			[lastSeen] varchar(128) N'$."lastSeen"',
			[rawX] int N'$."rawX"',
			[rawY] int N'$."rawY"',
			[rawUnit] nvarchar(64) N'$."rawUnit"')
END