/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2016 (13.0.1742)
    Source Database Engine Edition : Microsoft SQL Server Standard Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2016
    Target Database Engine Edition : Microsoft SQL Server Standard Edition
    Target Database Engine Type : Standalone SQL Server
*/

USE [JCE]
GO

/****** Object:  Table [dbo].[Location_History]    Script Date: 2/8/2018 10:48:44 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Location_History](
	[macAddress] [nchar](17) NOT NULL,
	[mapHierarchyString] [nvarchar](256) NULL,
	[mapCoordinateX] [float] NULL,
	[mapCoordinateY] [float] NULL,
	[mapCoordinateUnit] [nvarchar](32) NULL,
	[confidenceFactor] [int] NULL,
	[currentServerTime] [nchar](28) NOT NULL,
	[firstLocatedTime] [nchar](28) NULL,
	[lastLocatedTime] [nchar](28) NULL,
	[batteryPercentRemaining] [int] NULL,
	[batteryDaysRemaining] [int] NULL,
	[jcePid] [int] NOT NULL,
 CONSTRAINT [PK_Location_History] PRIMARY KEY CLUSTERED 
(
	[macAddress] ASC,
	[currentServerTime] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


