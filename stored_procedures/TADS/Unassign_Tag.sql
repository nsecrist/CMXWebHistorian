USE [JCE]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP PROCEDURE IF EXISTS [dbo].[Unassociate]
GO

CREATE PROCEDURE [dbo].[Unassociate](@mac VARCHAR(12), @date DateTime)
AS BEGIN

	UPDATE JCE_Assigned_Tags
	SET DateUnassigned = @date
	WHERE (DateUnassigned is NUll AND MAC_Address = @mac)


	INSERT INTO JCE_Tag_MasterList
	(MAC_Address, Tag_Status, StatusDate)
	VALUES (@mac, 'AVAILABLE', @date)

END
