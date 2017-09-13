USE [JCE]
GO
/****** Object:  StoredProcedure [dbo].[Location_CVT_Insert]    Script Date: 9/12/2017 8:03:39 PM ******/
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
			geoCoordinateLong, geoCoordinateUnit, JCE_PID
		FROM
			OPENJSON(@Location_NotificationJson)
        WITH
		 (	[deviceId] nchar(34) 'lax $.deviceId',
			[lastSeen] varchar(128) '$.lastSeen',
			[locationMapHierarchy] nvarchar(256) 'lax $.locationMapHierarchy',
			[locationCoordinateX] float 'lax $.locationCoordinate.x',
			[locationCoordinateY] float 'lax $.locationCoordinate.y',
			[locationCoordinateZ] float 'lax $.locationCoordinate.z',
			[locationCoordinateUnit] nvarchar(64) 'lax $.locationCoordinate.unit',
			[geoCoordinateLat] float 'lax $.geoCoordinate.lattitude',
			[geoCoordinateLong] float 'lax $.geoCoordinate.longitude',
			[geoCoordinateUnit] nvarchar(64) 'lax $.geoCoordinate.unit',
			[JCE_PID] int 'strict $.jce_pid'
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
