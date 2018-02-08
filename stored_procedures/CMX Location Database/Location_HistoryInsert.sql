USE [JCE_TEST]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Location_History_Insert](@Location_History_Json NVARCHAR(MAX))
AS BEGIN

	INSERT INTO Location_History(macAddress, mapHierarchyString, mapCoordinateX, mapCoordinateY, mapCoordinateUnit, confidenceFactor, currentServerTime, firstLocatedTime, lastLocatedTime, batteryPercentRemaining, batteryDaysRemaining, jcePid)
	SELECT macAddress, mapHierarchyString, mapCoordinateX, mapCoordinateY, mapCoordinateUnit, confidenceFactor, currentServerTime, firstLocatedTime, lastLocatedTime, batteryPercentRemaining, batteryDaysRemaining, jcePid
	FROM OPENJSON(@Location_History_Json)
		WITH (
			macAddress nchar(17) 'strict $.macAddress',
			mapHierarchyString nvarchar(256) 'lax $.mapInfo.mapHierarchyString',
			mapCoordinateX float 'lax $.mapCoordinate.x',
			mapCoordinateY float 'lax $.mapCoordinate.y',
			mapCoordinateUnit nvarchar(32) 'lax $.mapCoordinate.unit',
			confidenceFactor int 'lax $.confidenceFactor',
			currentServerTime nchar(28) 'lax $.statistics.currentServerTime',
			firstLocatedTime nchar(28) 'lax $.statistics.firstLocatedTime',
			lastLocatedTime nchar(28) 'lax $.statistics.lastLocatedTime',
			batteryPercentRemaining int 'lax $.batteryInfo.percentRemaining',
			batteryDaysRemaining int 'lax $.batteryInfo.daysRemaining',
			jcePid int 'lax $.jcePid'
		)
END
