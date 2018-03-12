INSERT INTO Location_History
	SELECT *
        	,cast(convert(datetimeoffset(7),t2.validDateTime,4) as date) validDate
		,cast(convert(datetimeoffset(7),t2.validDateTime,4) as datetime) validTimestamp
		,cast(convert(datetimeoffset(7),t2.validDateTime,4) as smalldatetime) indexTimestamp
	FROM (
		SELECT *
			,convert(datetimeoffset(7), left(t1.currentServerTime,len(t1.currentServerTime) -2) + ':' + right(t1.currentServerTime,2), 4) validDateTime
		FROM (
			SELECT *
			FROM OPENJSON(@Location_History_Json)
				WITH (  
					macAddress nchar(17) 'strict $.macAddress'
    					,mapHierarchyString nvarchar(256) 'lax $.mapInfo.mapHierarchyString'
    					,mapCoordinateX float 'lax $.mapCoordinate.x'
    					,mapCoordinateY float 'lax $.mapCoordinate.y'
    					,mapCoordinateUnit nvarchar(32) 'lax $.mapCoordinate.unit'
    					,confidenceFactor int 'lax $.confidenceFactor'
    					,currentServerTime nchar(28) 'lax $.statistics.currentServerTime'
    					,firstLocatedTime nchar(28) 'lax $.statistics.firstLocatedTime'
    					,lastLocatedTime nchar(28) 'lax $.statistics.lastLocatedTime'
    					,batteryPercentRemaining int 'lax $.batteryInfo.percentRemaining'
    					,batteryDaysRemaining int 'lax $.batteryInfo.daysRemaining'
					,jcePid int 'strict $.jcePid'
				)
		) as t1
	) as t2