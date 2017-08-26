USE [JCE]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP PROCEDURE IF EXISTS [dbo].[Associate]
GO

CREATE PROCEDURE [dbo].[Associate](@mac VARCHAR(12), @pid int, @date DateTime)
AS BEGIN

	INSERT INTO JCE_Assigned_Tags
	(MAC_Address, JCE_PID, DateAssigned)
	VALUES (@mac, @pid, @date)


	INSERT INTO JCE_Tag_MasterList
	(MAC_Address, Tag_Status, StatusDate)
	VALUES (@mac, 'Assigned', @date)

END
GO
