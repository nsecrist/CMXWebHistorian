DECLARE @cMacAddress nchar(17)
DECLARE @cCurrentServerTime nchar(28)

DECLARE @validDateTime datetimeoffset(7)
DECLARE @validDate	date
DECLARE @indexTimestamp smalldatetime
DECLARE @validTimestamp datetime

DECLARE MY_CURSOR CURSOR 
FOR 
SELECT macAddress, currentServerTime
FROM Location_History

OPEN MY_CURSOR
FETCH NEXT FROM MY_CURSOR INTO @cMacAddress, @cCurrentServerTime
WHILE @@FETCH_STATUS = 0
BEGIN
	set @validDateTime = convert(datetimeoffset(7), left(@cCurrentServerTime,len(@cCurrentServerTime) -2) + ':' + right(@cCurrentServerTime,2), 4)
	set @validDate = cast(@validDateTime as date)
	set @validTimestamp = cast(@validDateTime as datetime)
	set @indexTimestamp = cast(@validDateTime as smalldatetime)

    UPDATE Location_History
	SET validDateTime = @validDateTime, validDate = @validDate, validTimestamp = @validTimestamp, indexTimestamp = @indexTimestamp
	WHERE macAddress = @cMacAddress AND currentServerTime = @cCurrentServerTime
    PRINT @cMacAddress + ' : ' + @cCurrentServerTime
    FETCH NEXT FROM MY_CURSOR INTO @cMacAddress, @cCurrentServerTime
END
CLOSE MY_CURSOR
DEALLOCATE MY_CURSOR
