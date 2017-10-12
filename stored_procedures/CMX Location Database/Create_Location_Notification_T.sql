USE [JCE]
GO

/****** Object:  Table [dbo].[Location_Notification]    Script Date: 9/11/2017 3:58:53 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Location_Notification](
	[subscriptionName] [nvarchar](128) NOT NULL,
	[JCE_PID] [int] NOT NULL,
	[eventId] [int] NULL,
	[locationMapHierarchy] [nvarchar](128) NOT NULL,
	[locationCoordinateX] [float] NOT NULL,
	[locationCoordinateY] [float] NOT NULL,
	[locationCoordinateZ] [float] NOT NULL,
	[locationCoordinateUnit] [nvarchar](32) NOT NULL,
	[geoCoordinateLat] [float] NULL,
	[geoCoordinateLong] [float] NULL,
	[geoCoordinateUnit] [nvarchar](32) NULL,
	[confidenceFactor] [int] NOT NULL,
	[apMacAddress] [nchar](17) NULL,
	[associated] [bit] NULL,
	[username] [nvarchar](50) NULL,
	[ipaddress] [nchar](10) NULL,
	[ssid] [nvarchar](32) NULL,
	[band] [nvarchar](32) NULL,
	[floorId] [nvarchar](128) NOT NULL,
	[floorRefId] [nvarchar](128) NULL,
	[entity] [nvarchar](32) NOT NULL,
	[deviceId] [nchar](17) NOT NULL,
	[lastSeen] [varchar](128) NOT NULL,
	[rawX] [int] NULL,
	[rawY] [int] NULL,
	[rawUnit] [nvarchar](32) NULL,
	[timestamp] [nchar](15) NULL,
	[notificationType] [nvarchar](128) NULL,
	[crewcode] varchar(4) NULL
) ON [PRIMARY]
GO
