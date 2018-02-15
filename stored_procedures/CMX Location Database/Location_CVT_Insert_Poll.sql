USE [JCE]
GO
/****** Object:  StoredProcedure [dbo].[Location_CVT_Insert_Poll]    Script Date: 10/4/2017 2:59:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Location_CVT_Insert_Poll](@Location_History_Json NVARCHAR(MAX))
AS BEGIN

  MERGE INTO Location_CVT AS C
  USING
  (		SELECT
			deviceID, lastSeen, locationMapHierarchy, locationCoordinateX,
			locationCoordinateY, locationCoordinateUnit, JCE_PID
		FROM
			OPENJSON(@Location_NotificationJson)
        WITH
		 (	[deviceId] nchar(34) 'strict $.macAddress',
			[lastSeen] varchar(128) 'lax $.statistics.lastLocatedTime',
			[locationMapHierarchy] nvarchar(256) 'lax $.mapHierarchyString',
			[locationCoordinateX] float 'lax $.mapCoordinate.x',
			[locationCoordinateY] float 'lax $.mapCoordinate.y',
			[locationCoordinateUnit] nvarchar(64) 'lax $.mapCoordinate.unit',
			[JCE_PID] int 'strict $.jcePid'
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
			C.JCE_PID = InputJSON.jce_pid
    WHEN NOT MATCHED THEN
      INSERT (deviceId, lastSeen, locationMapHierarchy, locationCoordinateX,
			  locationCoordinateY, locationCoordinateUnit, JCE_PID)
      VALUES (InputJSON.deviceId, InputJSON.lastSeen, InputJSON.locationMapHierarchy,
			  InputJSON.locationCoordinateX, InputJSON.locationCoordinateY,
              InputJSON.locationCoordinateUnit, InputJSON.jce_pid);
END
