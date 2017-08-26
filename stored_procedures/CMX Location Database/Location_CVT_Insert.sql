USE [SecristTestDB]
GO
/****** Object:  StoredProcedure [dbo].[Location_CVT_Insert]    Script Date: 8/10/2017 2:57:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Location_CVT_Insert](@Location_NotificationJson NVARCHAR(MAX))
AS BEGIN

  MERGE INTO Location_CVT AS C
  USING
  (		SELECT
			deviceID, lastSeen, locationMapHierarchy, locationCoordinateX,
			locationCoordinateY, locationCoordinateUnit, geoCoordinateLat,
			geoCoordinateLong, geoCoordinateUnit
		FROM
			OPENJSON(@Location_NotificationJson)
        WITH
		 (	[deviceId] nchar(17) 'lax $.deviceId',
			[lastSeen] varchar(128) '$.lastSeen',
			[locationMapHierarchy] nvarchar(128) 'lax $.locationMapHierarchy',
			[locationCoordinateX] float 'lax $.locationCoordinate.x',
			[locationCoordinateY] float 'lax $.locationCoordinate.y',
			[locationCoordinateUnit] nvarchar(64) 'lax $.locationCoordinate.unit',
			[geoCoordinateLat] float 'lax $.geoCoordinate.lattitude',
			[geoCoordinateLong] float 'lax $.geoCoordinate.longitude',
			[geoCoordinateUnit] nvarchar(64) 'lax $.geoCoordinate.unit'
		 ) AS InputJSON
  ) AS InputJSON
  ON (C.deviceId = InputJSON.deviceId)
    WHEN MATCHED THEN
      UPDATE
		SET C.deviceId = InputJSON.deviceId,
			C.lastSeen = InputJSON.lastSeen,
			C.locationMapHierarchy = InputJSON.locationMapHierarchy,
			C.locationCoordinateX = InputJSON.locationCoordinateX,
			C.locationCoordinateY = InputJSON.locationCoordinateY,
			C.locationCoordinateUnit = InputJSON.locationCoordinateUnit,
			C.geoCoordinateLat = InputJSON.geoCoordinateLat,
			C.geoCoordinateLong = InputJSON.geoCoordinateLong,
			C.geoCoordinateUnit = InputJSON.geoCoordinateUnit
    WHEN NOT MATCHED THEN
      INSERT (deviceId, lastSeen, locationMapHierarchy, locationCoordinateX,
			  locationCoordinateY, locationCoordinateUnit, geoCoordinateLat,
			  geoCoordinateLong, geoCoordinateUnit)
      VALUES (InputJSON.deviceId, InputJSON.lastSeen, InputJSON.locationMapHierarchy,
			  InputJSON.locationCoordinateX, InputJSON.locationCoordinateY,
              InputJSON.locationCoordinateUnit, InputJSON.geoCoordinateLat,
			  InputJSON.geoCoordinateLong, InputJSON.geoCoordinateUnit);
END
