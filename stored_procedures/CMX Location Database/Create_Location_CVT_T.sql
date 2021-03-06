USE [JCE]
GO

/****** Object:  Table [dbo].[Location_CVT]    Script Date: 9/11/2017 3:58:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Location_CVT](
	[deviceId] [nchar](17) NOT NULL,
	[lastSeen] [varchar](128) NOT NULL,
	[locationMapHierarchy] [nvarchar](128) NOT NULL,
	[locationCoordinateX] [float] NOT NULL,
	[locationCoordinateY] [float] NOT NULL,
	[locationCoordinateUnit] [nvarchar](32) NOT NULL,
	[geoCoordinateLat] [float] NULL,
	[geoCoordinateLong] [float] NULL,
	[geoCoordinateUnit] [nvarchar](32) NULL,
	[JCE_PID] [int] NOT NULL,
 CONSTRAINT [PK_Location_CVT] PRIMARY KEY CLUSTERED
(
	[deviceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
