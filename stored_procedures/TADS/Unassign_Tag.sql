/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2016 (13.0.1742)
    Source Database Engine Edition : Microsoft SQL Server Standard Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2017
    Target Database Engine Edition : Microsoft SQL Server Standard Edition
    Target Database Engine Type : Standalone SQL Server
*/

USE [JCE]
GO
/****** Object:  StoredProcedure [dbo].[Unassociate]    Script Date: 10/12/2017 1:46:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[Unassociate](@mac VARCHAR(12), @date DateTime)
AS BEGIN

	UPDATE JCE_Assigned_Tags
	SET DateUnassigned = @date
	WHERE (DateUnassigned is NUll AND MAC_Address = @mac)


	INSERT INTO JCE_Tag_MasterList
	(MAC_Address, Tag_Status, StatusDate)
	VALUES (@mac, 'AVAILABLE', @date)

END
