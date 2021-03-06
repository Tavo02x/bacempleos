USE [master]
GO
/****** Object:  Database [bac2_db]    Script Date: 13/9/2018 00:39:43 ******/
CREATE DATABASE [bac2_db]
GO
Use [bac2_db]
/****** Object:  Table [dbo].[AreasLaborales]    Script Date: 13/9/2018 00:39:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AreasLaborales](
	[IdArea] [int] IDENTITY(1,1) NOT NULL,
	[Area] [varchar](100) NOT NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_AreasLaborales] PRIMARY KEY CLUSTERED 
(
	[IdArea] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AreasPostulante]    Script Date: 13/9/2018 00:39:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AreasPostulante](
	[IdPostulante] [int] NOT NULL,
	[IdArea] [int] NOT NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_AreaPostulante] PRIMARY KEY CLUSTERED 
(
	[IdPostulante] ASC,
	[IdArea] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bitacora_Log]    Script Date: 13/9/2018 00:39:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bitacora_Log](
	[IdBitacora] [int] NOT NULL,
	[IdUsuario] [int] NOT NULL,
	[Accion] [varchar](50) NOT NULL,
	[Descripcion] [varchar](400) NOT NULL,
	[Direccion_IP] [varchar](50) NOT NULL,
	[ResponseData] [varchar](50) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_Bitacora_Log] PRIMARY KEY CLUSTERED 
(
	[IdBitacora] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Comentarios]    Script Date: 13/9/2018 00:39:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comentarios](
	[IdComentario] [int] NOT NULL,
	[IdPublicacion] [int] NULL,
	[IdUsuario] [int] NULL,
	[Descripcion] [varchar](1000) NULL,
	[FechaCreacion] [datetime] NULL,
	[Borrado] [bit] NULL,
 CONSTRAINT [PK_Comentarios] PRIMARY KEY CLUSTERED 
(
	[IdComentario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Configuraciones]    Script Date: 13/9/2018 00:39:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Configuraciones](
	[IdConfiguracion] [int] NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[Valor] [varchar](50) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_Configuraciones] PRIMARY KEY CLUSTERED 
(
	[IdConfiguracion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Discapacidad]    Script Date: 13/9/2018 00:39:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Discapacidad](
	[IdDescapacidad] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Discapacidad] PRIMARY KEY CLUSTERED 
(
	[IdDescapacidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Entrevistadores]    Script Date: 13/9/2018 00:39:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Entrevistadores](
	[IdEntrevistador] [int] NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_Entrevistadores] PRIMARY KEY CLUSTERED 
(
	[IdEntrevistador] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EstadoCivil]    Script Date: 13/9/2018 00:39:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EstadoCivil](
	[IdEstadoCivil] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_EstadoCivil] PRIMARY KEY CLUSTERED 
(
	[IdEstadoCivil] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ExperienciaLaboral]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ExperienciaLaboral](
	[IdExperienciaLaboral] [int] NOT NULL,
	[IdPostulante] [int] NULL,
	[FechaInicio] [date] NULL,
	[FechaFin] [date] NULL,
	[Empresa] [varchar](50) NULL,
	[CantAniosExperiencia] [nchar](10) NULL,
	[DescripcionPuesto] [varchar](50) NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_ExperienciaLaboral] PRIMARY KEY CLUSTERED 
(
	[IdExperienciaLaboral] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FeriaEmpleo]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FeriaEmpleo](
	[IdFeriaEmpleo] [int] NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[Borrado] [bit] NOT NULL,
	[VideoURL] [varchar](100) NOT NULL,
	[Titulo] [varchar](50) NOT NULL,
 CONSTRAINT [PK_FeriaEmpleo] PRIMARY KEY CLUSTERED 
(
	[IdFeriaEmpleo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FeriaEmpleo_Entrevistadores]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FeriaEmpleo_Entrevistadores](
	[IdFeriaEmpleo] [int] NOT NULL,
	[IdEntrevistador] [int] NOT NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_FeriaEmpleo_Entrevistadores] PRIMARY KEY CLUSTERED 
(
	[IdFeriaEmpleo] ASC,
	[IdEntrevistador] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FeriaEmpleo_Puestos]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FeriaEmpleo_Puestos](
	[IdFeriaEmpleo] [int] NOT NULL,
	[IdPuesto] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_FeriaEmpleo_Puestos] PRIMARY KEY CLUSTERED 
(
	[IdFeriaEmpleo] ASC,
	[IdPuesto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Idioma]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Idioma](
	[IdIdioma] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Idioma] PRIMARY KEY CLUSTERED 
(
	[IdIdioma] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Idiomas_Postulante]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Idiomas_Postulante](
	[IdIdioma] [int] NOT NULL,
	[IdPostulante] [int] NOT NULL,
	[Porcentaje] [decimal](18, 0) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_IdiomasPersonas] PRIMARY KEY CLUSTERED 
(
	[IdIdioma] ASC,
	[IdPostulante] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Inscripciones]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Inscripciones](
	[IdInscripcion] [int] NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MediosInformacion]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MediosInformacion](
	[IdMedioInformacion] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_MediosInformacion] PRIMARY KEY CLUSTERED 
(
	[IdMedioInformacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Monedas]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Monedas](
	[IdMoneda] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[Simbolo] [char](2) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_Monedas] PRIMARY KEY CLUSTERED 
(
	[IdMoneda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NivelAcademico]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NivelAcademico](
	[IdNivelAcademico] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[Secuencia] [int] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_NivelAcademico] PRIMARY KEY CLUSTERED 
(
	[IdNivelAcademico] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Paises_Bac]    Script Date: 13/9/2018 00:39:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Paises_Bac](
	[IdPais] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Paises] PRIMARY KEY CLUSTERED 
(
	[IdPais] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Paises_Bac_Usuario]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Paises_Bac_Usuario](
	[IdUsuario] [int] NOT NULL,
	[IdPais] [int] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Paises_Bac_Usuario] PRIMARY KEY CLUSTERED 
(
	[IdUsuario] ASC,
	[IdPais] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaisPostulante]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaisPostulante](
	[IdPostulante] [int] NOT NULL,
	[IdPais] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_PaisPostulante] PRIMARY KEY CLUSTERED 
(
	[IdPostulante] ASC,
	[IdPais] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Postulante]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Postulante](
	[IdPostulante] [int] NOT NULL,
	[NombreCompleto] [varchar](50) NOT NULL,
	[Nacionalidad] [varchar](50) NOT NULL,
	[Identificacion] [varchar](50) NOT NULL,
	[FechaNacimiento] [date] NOT NULL,
	[Genero] [bit] NOT NULL,
	[IdEstadoCivil] [int] NOT NULL,
	[Telefono] [varchar](50) NOT NULL,
	[ImagenURL] [varchar](50) NOT NULL,
	[OtraDiscapacidad] [varchar](50) NOT NULL,
	[PaisRecidencia] [varchar](50) NOT NULL,
	[Vehiculo] [bit] NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[IdZona1] [int] NOT NULL,
	[IdZona2] [int] NOT NULL,
	[IdZona3] [int] NOT NULL,
	[EstudiaActualidad] [bit] NOT NULL,
	[GradoAcademico] [int] NOT NULL,
	[Profesion] [varchar](50) NOT NULL,
	[IdPretensionSalarial] [int] NOT NULL,
	[DescripcionCualidades] [varchar](1000) NOT NULL,
	[DescripcionVentajaCompetitiva] [varchar](1000) NOT NULL,
	[TrabajoBAC] [bit] NOT NULL,
	[CurriculumURL] [varchar](400) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[IdUsuario] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
 CONSTRAINT [PK_Postulante] PRIMARY KEY CLUSTERED 
(
	[IdPostulante] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Postulante_Discapacidad]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Postulante_Discapacidad](
	[IdPostulante] [int] NOT NULL,
	[IdDiscapacidad] [int] NOT NULL,
	[FechaCreacion] [datetime] NULL,
	[Borrado] [bit] NULL,
 CONSTRAINT [PK_Postulante_Discapacidad] PRIMARY KEY CLUSTERED 
(
	[IdPostulante] ASC,
	[IdDiscapacidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Postulante_MediosInformacion]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Postulante_MediosInformacion](
	[IdPostulante] [int] NOT NULL,
	[IdMedioInformacion] [int] NOT NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Postulante_MediosInformacion] PRIMARY KEY CLUSTERED 
(
	[IdPostulante] ASC,
	[IdMedioInformacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PretensionSalarial]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PretensionSalarial](
	[IdPretension] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[FechaCreacion] [datetime] NULL,
	[Borrado] [bit] NOT NULL,
	[SalarioMinimo] [decimal](18, 2) NOT NULL,
	[SalarioMaximo] [decimal](18, 2) NOT NULL,
	[IdMoneda] [int] NOT NULL,
 CONSTRAINT [PK_PretensionSalarial] PRIMARY KEY CLUSTERED 
(
	[IdPretension] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Publicaciones]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Publicaciones](
	[IdPublicacion] [int] NOT NULL,
	[Titulo] [nchar](10) NULL,
	[Desccripcion] [varchar](max) NULL,
	[FechaPublicacion] [datetime] NULL,
	[Borrado] [bit] NULL,
	[IdTipoPublicacion] [int] NULL,
	[Tags] [varchar](400) NULL,
 CONSTRAINT [PK_Publicaciones] PRIMARY KEY CLUSTERED 
(
	[IdPublicacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Puesto_TipoJornada]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Puesto_TipoJornada](
	[IdJornada] [int] NOT NULL,
	[IdPuesto] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
 CONSTRAINT [PK_Puesto_TipoJornada] PRIMARY KEY CLUSTERED 
(
	[IdJornada] ASC,
	[IdPuesto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Puestos]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Puestos](
	[IdPuesto] [int] NOT NULL,
	[Titulo] [varchar](100) NOT NULL,
	[Descripcion] [varchar](max) NOT NULL,
	[ImagenURL] [varchar](100) NOT NULL,
	[IdArea] [int] NOT NULL,
	[IdNivelAcademico] [int] NOT NULL,
	[FechaCierreOferta] [date] NOT NULL,
	[Publicado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_Puestos] PRIMARY KEY CLUSTERED 
(
	[IdPuesto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Puestos_Idiomas]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Puestos_Idiomas](
	[IdIdioma] [int] NOT NULL,
	[IdPuesto] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Puestos_Idiomas] PRIMARY KEY CLUSTERED 
(
	[IdIdioma] ASC,
	[IdPuesto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Puestos_Postulante]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Puestos_Postulante](
	[IdPuesto] [int] NOT NULL,
	[IdPostulante] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaRegistro] [datetime] NOT NULL,
 CONSTRAINT [PK_Puestos_Postulante] PRIMARY KEY CLUSTERED 
(
	[IdPuesto] ASC,
	[IdPostulante] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReferenciasLaborales]    Script Date: 13/9/2018 00:39:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReferenciasLaborales](
	[IdReferencia] [int] NULL,
	[IdPostulante] [int] NULL,
	[UrlReferencia] [varchar](50) NULL,
	[Borrada] [bit] NULL,
	[FechaCreacion] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[IdRol] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[IdRol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sesiones]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sesiones](
	[IdUsuario] [int] NOT NULL,
	[User_key] [varchar](1000) NOT NULL,
	[Secret_key] [varchar](1000) NOT NULL,
	[Hostname] [varchar](50) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[FechaExpiración] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoJornada]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TipoJornada](
	[IdJornada] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_TipoJornada] PRIMARY KEY CLUSTERED 
(
	[IdJornada] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoLogin]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TipoLogin](
	[IdTipoLogin] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
 CONSTRAINT [PK_TipoLogin] PRIMARY KEY CLUSTERED 
(
	[IdTipoLogin] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoPublicacion]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TipoPublicacion](
	[IdTipoPublicacion] [int] NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[FechaCreacion] [datetime] NULL,
	[Borrado] [bit] NULL,
 CONSTRAINT [PK_TipoPublicacion] PRIMARY KEY CLUSTERED 
(
	[IdTipoPublicacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Titulos]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Titulos](
	[IdTitulo] [int] NOT NULL,
	[Descripcion] [nchar](10) NULL,
	[TipoCertificacion] [int] NULL,
	[IdPostulante] [int] NULL,
	[Institucion] [varchar](50) NULL,
	[AnioInicio] [int] NULL,
	[AnioFin] [int] NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Titulos] PRIMARY KEY CLUSTERED 
(
	[IdTitulo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[IdUsuario] [int] NOT NULL,
	[IdDrupal] [int] NULL,
	[NombreCompleto] [varchar](100) NOT NULL,
	[Usuario] [varchar](100) NOT NULL,
	[Password] [varchar](100) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[IdPais] [int] NOT NULL,
	[IdTipoLogin] [int] NOT NULL,
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED 
(
	[IdUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario_Roles]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario_Roles](
	[IdUsuario] [int] NOT NULL,
	[IdRol] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Usuario_Roles] PRIMARY KEY CLUSTERED 
(
	[IdUsuario] ASC,
	[IdRol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Zona_Bac]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Zona_Bac](
	[IdZona] [int] NOT NULL,
	[Descripcion] [varchar](100) NOT NULL,
	[IdPais] [int] NOT NULL,
	[Borrado] [bit] NOT NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Zona] PRIMARY KEY CLUSTERED 
(
	[IdZona] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Zona1]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Zona1](
	[IdZona1] [int] NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[Borrado] [bit] NOT NULL,
 CONSTRAINT [PK_Provincia] PRIMARY KEY CLUSTERED 
(
	[IdZona1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Zona2]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Zona2](
	[IdZona2] [int] NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[IdZona1] [int] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[Borrado] [bit] NOT NULL,
 CONSTRAINT [PK_Canton] PRIMARY KEY CLUSTERED 
(
	[IdZona2] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Zona3]    Script Date: 13/9/2018 00:39:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Zona3](
	[IdZona3] [int] NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
	[IdZona2] [int] NOT NULL,
	[Borrado] [bit] NULL,
	[FechaCreacion] [datetime] NULL,
 CONSTRAINT [PK_Distrito] PRIMARY KEY CLUSTERED 
(
	[IdZona3] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AreasLaborales] ON 
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (1, N'Servicio al Cliente, Sucursales, Ventas y Call Center', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (2, N'Finanzas, Economía, Contabilidad, Tesorería y Contraloría', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (3, N'Inteligencia de Negocio, Estadística y Estrategia', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (4, N'Gestión y Dirección de Proyectos y Procesos', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (5, N'Mercadeo, Diseño y Publicidad', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (6, N'Informática, Telemática, Seguridad, Soporte y Desarrollo de Sistemas', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (7, N'Banca Empresarial y Banca Personal', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (8, N'Recursos Humanos, Relaciones Corporativas y Responsabilidad Social', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (9, N'Calidad, Auditoría, Cumplimiento y Riesgo', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (10, N'Transformación Digital, Innovación, Canales Digitales y Experiencia al Cliente', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (11, N'Seguros, Pymes y Pensiones', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
INSERT [dbo].[AreasLaborales] ([IdArea], [Area], [Borrado], [FechaCreacion]) VALUES (12, N'Operaciones de Tarjeta', 0, CAST(N'2018-08-30T12:43:46.383' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[AreasLaborales] OFF
GO
SET IDENTITY_INSERT [dbo].[Discapacidad] ON 
GO
INSERT [dbo].[Discapacidad] ([IdDescapacidad], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Ninguna', 0, CAST(N'2018-08-30T13:15:22.843' AS DateTime))
GO
INSERT [dbo].[Discapacidad] ([IdDescapacidad], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'Auditiva', 0, CAST(N'2018-08-30T13:15:22.843' AS DateTime))
GO
INSERT [dbo].[Discapacidad] ([IdDescapacidad], [Descripcion], [Borrado], [FechaCreacion]) VALUES (3, N'Cognitiva', 0, CAST(N'2018-08-30T13:15:22.843' AS DateTime))
GO
INSERT [dbo].[Discapacidad] ([IdDescapacidad], [Descripcion], [Borrado], [FechaCreacion]) VALUES (4, N'Física', 0, CAST(N'2018-08-30T13:15:22.843' AS DateTime))
GO
INSERT [dbo].[Discapacidad] ([IdDescapacidad], [Descripcion], [Borrado], [FechaCreacion]) VALUES (5, N'Visual', 0, CAST(N'2018-08-30T13:15:22.843' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Discapacidad] OFF
GO
SET IDENTITY_INSERT [dbo].[EstadoCivil] ON 
GO
INSERT [dbo].[EstadoCivil] ([IdEstadoCivil], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Soltero', 0, CAST(N'2018-08-31T10:13:44.493' AS DateTime))
GO
INSERT [dbo].[EstadoCivil] ([IdEstadoCivil], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'Divorciado', 0, CAST(N'2018-08-31T10:13:44.493' AS DateTime))
GO
INSERT [dbo].[EstadoCivil] ([IdEstadoCivil], [Descripcion], [Borrado], [FechaCreacion]) VALUES (3, N'Viudo', 0, CAST(N'2018-08-31T10:13:44.493' AS DateTime))
GO
INSERT [dbo].[EstadoCivil] ([IdEstadoCivil], [Descripcion], [Borrado], [FechaCreacion]) VALUES (4, N'Casado', 0, CAST(N'2018-08-31T10:13:44.493' AS DateTime))
GO
INSERT [dbo].[EstadoCivil] ([IdEstadoCivil], [Descripcion], [Borrado], [FechaCreacion]) VALUES (5, N'Unión Libre', 0, CAST(N'2018-08-31T10:13:44.493' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[EstadoCivil] OFF
GO
SET IDENTITY_INSERT [dbo].[Idioma] ON 
GO
INSERT [dbo].[Idioma] ([IdIdioma], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Español', 0, CAST(N'2018-08-30T12:49:46.887' AS DateTime))
GO
INSERT [dbo].[Idioma] ([IdIdioma], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'Inglés', 0, CAST(N'2018-08-30T12:49:46.887' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Idioma] OFF
GO
SET IDENTITY_INSERT [dbo].[MediosInformacion] ON 
GO
INSERT [dbo].[MediosInformacion] ([IdMedioInformacion], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Correo Electrónico', 0, CAST(N'2018-08-31T10:18:31.510' AS DateTime))
GO
INSERT [dbo].[MediosInformacion] ([IdMedioInformacion], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'SMS', 0, CAST(N'2018-08-31T10:18:31.510' AS DateTime))
GO
INSERT [dbo].[MediosInformacion] ([IdMedioInformacion], [Descripcion], [Borrado], [FechaCreacion]) VALUES (3, N'Whatsapp', 0, CAST(N'2018-08-31T10:18:31.510' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[MediosInformacion] OFF
GO
SET IDENTITY_INSERT [dbo].[Monedas] ON 
GO
INSERT [dbo].[Monedas] ([IdMoneda], [Descripcion], [Simbolo], [Borrado], [FechaCreacion]) VALUES (1, N'Colones', N'¢ ', 0, CAST(N'2018-08-31T10:36:51.650' AS DateTime))
GO
INSERT [dbo].[Monedas] ([IdMoneda], [Descripcion], [Simbolo], [Borrado], [FechaCreacion]) VALUES (2, N'Dolares', N'$ ', 0, CAST(N'2018-08-31T10:36:51.650' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Monedas] OFF
GO
SET IDENTITY_INSERT [dbo].[NivelAcademico] ON 
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (1, N'Educación Básica Primaria', 0, 1, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (2, N'Educación Básica Secundaria', 0, 2, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (3, N'Bachillerato / Educación Media', 0, 3, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (4, N'Educación Técnico/Profesional', 0, 4, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (5, N'Bachillerato Universitario', 0, 5, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (6, N'Licenciatura', 0, 6, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (7, N'Maestría', 0, 7, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
INSERT [dbo].[NivelAcademico] ([IdNivelAcademico], [Descripcion], [Borrado], [Secuencia], [FechaCreacion]) VALUES (8, N'Doctorado', 0, 8, CAST(N'2018-08-30T13:37:52.867' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[NivelAcademico] OFF
GO
SET IDENTITY_INSERT [dbo].[Paises_Bac] ON 
GO
INSERT [dbo].[Paises_Bac] ([IdPais], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Costa Rica', 0, CAST(N'2018-08-30T12:21:20.753' AS DateTime))
GO
INSERT [dbo].[Paises_Bac] ([IdPais], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'Panamá', 0, CAST(N'2018-08-30T12:21:20.753' AS DateTime))
GO
INSERT [dbo].[Paises_Bac] ([IdPais], [Descripcion], [Borrado], [FechaCreacion]) VALUES (3, N'Honduras', 0, CAST(N'2018-08-30T12:21:20.753' AS DateTime))
GO
INSERT [dbo].[Paises_Bac] ([IdPais], [Descripcion], [Borrado], [FechaCreacion]) VALUES (4, N'El Salvador', 0, CAST(N'2018-08-30T12:21:20.753' AS DateTime))
GO
INSERT [dbo].[Paises_Bac] ([IdPais], [Descripcion], [Borrado], [FechaCreacion]) VALUES (5, N'Nicaragua', 0, CAST(N'2018-08-30T12:21:20.753' AS DateTime))
GO
INSERT [dbo].[Paises_Bac] ([IdPais], [Descripcion], [Borrado], [FechaCreacion]) VALUES (6, N'Nicaragua', 0, CAST(N'2018-08-30T12:21:20.753' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Paises_Bac] OFF
GO
SET IDENTITY_INSERT [dbo].[PretensionSalarial] ON 
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (1, N'200-400', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(200.00 AS Decimal(18, 2)), CAST(400.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (2, N'401-600', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(401.00 AS Decimal(18, 2)), CAST(600.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (3, N'601-800', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(601.00 AS Decimal(18, 2)), CAST(800.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (4, N'801-1000', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(801.00 AS Decimal(18, 2)), CAST(1000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (5, N'1001-1400', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(1001.00 AS Decimal(18, 2)), CAST(1400.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (6, N'1401-2000', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(1401.00 AS Decimal(18, 2)), CAST(2000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (7, N'2001-3000', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(2001.00 AS Decimal(18, 2)), CAST(3000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (8, N'3001-4000', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(3001.00 AS Decimal(18, 2)), CAST(4000.00 AS Decimal(18, 2)), 2)
GO
INSERT [dbo].[PretensionSalarial] ([IdPretension], [Descripcion], [FechaCreacion], [Borrado], [SalarioMinimo], [SalarioMaximo], [IdMoneda]) VALUES (9, N'Más de 4001', CAST(N'2018-08-31T10:41:00.637' AS DateTime), 0, CAST(4001.00 AS Decimal(18, 2)), CAST(10000.00 AS Decimal(18, 2)), 2)
GO
SET IDENTITY_INSERT [dbo].[PretensionSalarial] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 
GO
INSERT [dbo].[Roles] ([IdRol], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Administrador Regional', 0, CAST(N'2018-08-30T12:57:15.267' AS DateTime))
GO
INSERT [dbo].[Roles] ([IdRol], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'Administrador País', 0, CAST(N'2018-08-30T12:57:15.267' AS DateTime))
GO
INSERT [dbo].[Roles] ([IdRol], [Descripcion], [Borrado], [FechaCreacion]) VALUES (3, N'Postulante', 0, CAST(N'2018-08-30T12:57:15.267' AS DateTime))
GO
INSERT [dbo].[Roles] ([IdRol], [Descripcion], [Borrado], [FechaCreacion]) VALUES (4, N'Entrevistador', 0, CAST(N'2018-08-30T12:57:15.267' AS DateTime))
GO
INSERT [dbo].[Roles] ([IdRol], [Descripcion], [Borrado], [FechaCreacion]) VALUES (5, N'Administrador de contenidos', 0, CAST(N'2018-08-30T12:57:15.267' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[TipoJornada] ON 
GO
INSERT [dbo].[TipoJornada] ([IdJornada], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Fines de semana', 0, CAST(N'2018-08-30T18:00:17.110' AS DateTime))
GO
INSERT [dbo].[TipoJornada] ([IdJornada], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'Jornada Diurna', 0, CAST(N'2018-08-30T18:00:17.110' AS DateTime))
GO
INSERT [dbo].[TipoJornada] ([IdJornada], [Descripcion], [Borrado], [FechaCreacion]) VALUES (3, N'Jornada Nocturna', 0, CAST(N'2018-08-30T18:00:17.110' AS DateTime))
GO
INSERT [dbo].[TipoJornada] ([IdJornada], [Descripcion], [Borrado], [FechaCreacion]) VALUES (4, N'Medio Tiempo', 0, CAST(N'2018-08-30T18:00:17.110' AS DateTime))
GO
INSERT [dbo].[TipoJornada] ([IdJornada], [Descripcion], [Borrado], [FechaCreacion]) VALUES (5, N'Tiempo Completo', 0, CAST(N'2018-08-30T18:00:17.110' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[TipoJornada] OFF
GO
SET IDENTITY_INSERT [dbo].[TipoLogin] ON 
GO
INSERT [dbo].[TipoLogin] ([IdTipoLogin], [Descripcion], [Borrado], [FechaCreacion]) VALUES (1, N'Aplicación', 0, CAST(N'2018-08-30T13:05:04.180' AS DateTime))
GO
INSERT [dbo].[TipoLogin] ([IdTipoLogin], [Descripcion], [Borrado], [FechaCreacion]) VALUES (2, N'Linkedin', 0, CAST(N'2018-08-30T13:05:04.180' AS DateTime))
GO
INSERT [dbo].[TipoLogin] ([IdTipoLogin], [Descripcion], [Borrado], [FechaCreacion]) VALUES (3, N'Facebook', 0, CAST(N'2018-08-30T13:05:04.180' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[TipoLogin] OFF
GO
ALTER TABLE [dbo].[AreasPostulante]  WITH CHECK ADD  CONSTRAINT [FK_AreaPostulante_AreasLaborales] FOREIGN KEY([IdArea])
REFERENCES [dbo].[AreasLaborales] ([IdArea])
GO
ALTER TABLE [dbo].[AreasPostulante] CHECK CONSTRAINT [FK_AreaPostulante_AreasLaborales]
GO
ALTER TABLE [dbo].[AreasPostulante]  WITH CHECK ADD  CONSTRAINT [FK_AreaPostulante_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[AreasPostulante] CHECK CONSTRAINT [FK_AreaPostulante_Postulante]
GO
ALTER TABLE [dbo].[Bitacora_Log]  WITH CHECK ADD  CONSTRAINT [FK_Bitacora_Log_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([IdUsuario])
GO
ALTER TABLE [dbo].[Bitacora_Log] CHECK CONSTRAINT [FK_Bitacora_Log_Usuario]
GO
ALTER TABLE [dbo].[Comentarios]  WITH CHECK ADD  CONSTRAINT [FK_Comentarios_Publicaciones] FOREIGN KEY([IdPublicacion])
REFERENCES [dbo].[Publicaciones] ([IdPublicacion])
GO
ALTER TABLE [dbo].[Comentarios] CHECK CONSTRAINT [FK_Comentarios_Publicaciones]
GO
ALTER TABLE [dbo].[Comentarios]  WITH CHECK ADD  CONSTRAINT [FK_Comentarios_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([IdUsuario])
GO
ALTER TABLE [dbo].[Comentarios] CHECK CONSTRAINT [FK_Comentarios_Usuario]
GO
ALTER TABLE [dbo].[ExperienciaLaboral]  WITH CHECK ADD  CONSTRAINT [FK_ExperienciaLaboral_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[ExperienciaLaboral] CHECK CONSTRAINT [FK_ExperienciaLaboral_Postulante]
GO
ALTER TABLE [dbo].[FeriaEmpleo_Entrevistadores]  WITH CHECK ADD  CONSTRAINT [FK_FeriaEmpleo_Entrevistadores_Entrevistadores] FOREIGN KEY([IdEntrevistador])
REFERENCES [dbo].[Entrevistadores] ([IdEntrevistador])
GO
ALTER TABLE [dbo].[FeriaEmpleo_Entrevistadores] CHECK CONSTRAINT [FK_FeriaEmpleo_Entrevistadores_Entrevistadores]
GO
ALTER TABLE [dbo].[FeriaEmpleo_Entrevistadores]  WITH CHECK ADD  CONSTRAINT [FK_FeriaEmpleo_Entrevistadores_FeriaEmpleo] FOREIGN KEY([IdFeriaEmpleo])
REFERENCES [dbo].[FeriaEmpleo] ([IdFeriaEmpleo])
GO
ALTER TABLE [dbo].[FeriaEmpleo_Entrevistadores] CHECK CONSTRAINT [FK_FeriaEmpleo_Entrevistadores_FeriaEmpleo]
GO
ALTER TABLE [dbo].[FeriaEmpleo_Puestos]  WITH CHECK ADD  CONSTRAINT [FK_FeriaEmpleo_Puestos_FeriaEmpleo] FOREIGN KEY([IdFeriaEmpleo])
REFERENCES [dbo].[FeriaEmpleo] ([IdFeriaEmpleo])
GO
ALTER TABLE [dbo].[FeriaEmpleo_Puestos] CHECK CONSTRAINT [FK_FeriaEmpleo_Puestos_FeriaEmpleo]
GO
ALTER TABLE [dbo].[FeriaEmpleo_Puestos]  WITH CHECK ADD  CONSTRAINT [FK_FeriaEmpleo_Puestos_Puestos] FOREIGN KEY([IdPuesto])
REFERENCES [dbo].[Puestos] ([IdPuesto])
GO
ALTER TABLE [dbo].[FeriaEmpleo_Puestos] CHECK CONSTRAINT [FK_FeriaEmpleo_Puestos_Puestos]
GO
ALTER TABLE [dbo].[Idiomas_Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Idiomas_Postulante_Idioma] FOREIGN KEY([IdIdioma])
REFERENCES [dbo].[Idioma] ([IdIdioma])
GO
ALTER TABLE [dbo].[Idiomas_Postulante] CHECK CONSTRAINT [FK_Idiomas_Postulante_Idioma]
GO
ALTER TABLE [dbo].[Idiomas_Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Idiomas_Postulante_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[Idiomas_Postulante] CHECK CONSTRAINT [FK_Idiomas_Postulante_Postulante]
GO
ALTER TABLE [dbo].[Paises_Bac_Usuario]  WITH CHECK ADD  CONSTRAINT [FK_Paises_Bac_Usuario_Paises_Bac] FOREIGN KEY([IdPais])
REFERENCES [dbo].[Paises_Bac] ([IdPais])
GO
ALTER TABLE [dbo].[Paises_Bac_Usuario] CHECK CONSTRAINT [FK_Paises_Bac_Usuario_Paises_Bac]
GO
ALTER TABLE [dbo].[Paises_Bac_Usuario]  WITH CHECK ADD  CONSTRAINT [FK_Paises_Bac_Usuario_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([IdUsuario])
GO
ALTER TABLE [dbo].[Paises_Bac_Usuario] CHECK CONSTRAINT [FK_Paises_Bac_Usuario_Usuario]
GO
ALTER TABLE [dbo].[PaisPostulante]  WITH CHECK ADD  CONSTRAINT [FK_PaisPostulante_Paises_Bac] FOREIGN KEY([IdPais])
REFERENCES [dbo].[Paises_Bac] ([IdPais])
GO
ALTER TABLE [dbo].[PaisPostulante] CHECK CONSTRAINT [FK_PaisPostulante_Paises_Bac]
GO
ALTER TABLE [dbo].[PaisPostulante]  WITH CHECK ADD  CONSTRAINT [FK_PaisPostulante_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[PaisPostulante] CHECK CONSTRAINT [FK_PaisPostulante_Postulante]
GO
ALTER TABLE [dbo].[Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_Canton] FOREIGN KEY([IdZona2])
REFERENCES [dbo].[Zona2] ([IdZona2])
GO
ALTER TABLE [dbo].[Postulante] CHECK CONSTRAINT [FK_Postulante_Canton]
GO
ALTER TABLE [dbo].[Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_Distrito] FOREIGN KEY([IdZona3])
REFERENCES [dbo].[Zona3] ([IdZona3])
GO
ALTER TABLE [dbo].[Postulante] CHECK CONSTRAINT [FK_Postulante_Distrito]
GO
ALTER TABLE [dbo].[Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_EstadoCivil] FOREIGN KEY([IdEstadoCivil])
REFERENCES [dbo].[EstadoCivil] ([IdEstadoCivil])
GO
ALTER TABLE [dbo].[Postulante] CHECK CONSTRAINT [FK_Postulante_EstadoCivil]
GO
ALTER TABLE [dbo].[Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_PretensionSalarial] FOREIGN KEY([IdPretensionSalarial])
REFERENCES [dbo].[PretensionSalarial] ([IdPretension])
GO
ALTER TABLE [dbo].[Postulante] CHECK CONSTRAINT [FK_Postulante_PretensionSalarial]
GO
ALTER TABLE [dbo].[Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_Provincia] FOREIGN KEY([IdZona1])
REFERENCES [dbo].[Zona1] ([IdZona1])
GO
ALTER TABLE [dbo].[Postulante] CHECK CONSTRAINT [FK_Postulante_Provincia]
GO
ALTER TABLE [dbo].[Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([IdUsuario])
GO
ALTER TABLE [dbo].[Postulante] CHECK CONSTRAINT [FK_Postulante_Usuario]
GO
ALTER TABLE [dbo].[Postulante_Discapacidad]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_Discapacidad_Discapacidad] FOREIGN KEY([IdDiscapacidad])
REFERENCES [dbo].[Discapacidad] ([IdDescapacidad])
GO
ALTER TABLE [dbo].[Postulante_Discapacidad] CHECK CONSTRAINT [FK_Postulante_Discapacidad_Discapacidad]
GO
ALTER TABLE [dbo].[Postulante_Discapacidad]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_Discapacidad_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[Postulante_Discapacidad] CHECK CONSTRAINT [FK_Postulante_Discapacidad_Postulante]
GO
ALTER TABLE [dbo].[Postulante_MediosInformacion]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_MediosInformacion_MediosInformacion] FOREIGN KEY([IdMedioInformacion])
REFERENCES [dbo].[MediosInformacion] ([IdMedioInformacion])
GO
ALTER TABLE [dbo].[Postulante_MediosInformacion] CHECK CONSTRAINT [FK_Postulante_MediosInformacion_MediosInformacion]
GO
ALTER TABLE [dbo].[Postulante_MediosInformacion]  WITH CHECK ADD  CONSTRAINT [FK_Postulante_MediosInformacion_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[Postulante_MediosInformacion] CHECK CONSTRAINT [FK_Postulante_MediosInformacion_Postulante]
GO
ALTER TABLE [dbo].[PretensionSalarial]  WITH CHECK ADD  CONSTRAINT [FK_PretensionSalarial_Monedas] FOREIGN KEY([IdMoneda])
REFERENCES [dbo].[Monedas] ([IdMoneda])
GO
ALTER TABLE [dbo].[PretensionSalarial] CHECK CONSTRAINT [FK_PretensionSalarial_Monedas]
GO
ALTER TABLE [dbo].[Publicaciones]  WITH CHECK ADD  CONSTRAINT [FK_Publicaciones_TipoPublicacion] FOREIGN KEY([IdTipoPublicacion])
REFERENCES [dbo].[TipoPublicacion] ([IdTipoPublicacion])
GO
ALTER TABLE [dbo].[Publicaciones] CHECK CONSTRAINT [FK_Publicaciones_TipoPublicacion]
GO
ALTER TABLE [dbo].[Puesto_TipoJornada]  WITH CHECK ADD  CONSTRAINT [FK_Puesto_TipoJornada_Puestos] FOREIGN KEY([IdPuesto])
REFERENCES [dbo].[Puestos] ([IdPuesto])
GO
ALTER TABLE [dbo].[Puesto_TipoJornada] CHECK CONSTRAINT [FK_Puesto_TipoJornada_Puestos]
GO
ALTER TABLE [dbo].[Puesto_TipoJornada]  WITH CHECK ADD  CONSTRAINT [FK_Puesto_TipoJornada_TipoJornada] FOREIGN KEY([IdJornada])
REFERENCES [dbo].[TipoJornada] ([IdJornada])
GO
ALTER TABLE [dbo].[Puesto_TipoJornada] CHECK CONSTRAINT [FK_Puesto_TipoJornada_TipoJornada]
GO
ALTER TABLE [dbo].[Puestos]  WITH CHECK ADD  CONSTRAINT [FK_Puestos_AreasLaborales] FOREIGN KEY([IdArea])
REFERENCES [dbo].[AreasLaborales] ([IdArea])
GO
ALTER TABLE [dbo].[Puestos] CHECK CONSTRAINT [FK_Puestos_AreasLaborales]
GO
ALTER TABLE [dbo].[Puestos]  WITH CHECK ADD  CONSTRAINT [FK_Puestos_NivelAcademico] FOREIGN KEY([IdNivelAcademico])
REFERENCES [dbo].[NivelAcademico] ([IdNivelAcademico])
GO
ALTER TABLE [dbo].[Puestos] CHECK CONSTRAINT [FK_Puestos_NivelAcademico]
GO
ALTER TABLE [dbo].[Puestos_Idiomas]  WITH CHECK ADD  CONSTRAINT [FK_Puestos_Idiomas_Idioma] FOREIGN KEY([IdIdioma])
REFERENCES [dbo].[Idioma] ([IdIdioma])
GO
ALTER TABLE [dbo].[Puestos_Idiomas] CHECK CONSTRAINT [FK_Puestos_Idiomas_Idioma]
GO
ALTER TABLE [dbo].[Puestos_Idiomas]  WITH CHECK ADD  CONSTRAINT [FK_Puestos_Idiomas_Puestos] FOREIGN KEY([IdPuesto])
REFERENCES [dbo].[Puestos] ([IdPuesto])
GO
ALTER TABLE [dbo].[Puestos_Idiomas] CHECK CONSTRAINT [FK_Puestos_Idiomas_Puestos]
GO
ALTER TABLE [dbo].[Puestos_Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Puestos_Postulante_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[Puestos_Postulante] CHECK CONSTRAINT [FK_Puestos_Postulante_Postulante]
GO
ALTER TABLE [dbo].[Puestos_Postulante]  WITH CHECK ADD  CONSTRAINT [FK_Puestos_Postulante_Puestos] FOREIGN KEY([IdPuesto])
REFERENCES [dbo].[Puestos] ([IdPuesto])
GO
ALTER TABLE [dbo].[Puestos_Postulante] CHECK CONSTRAINT [FK_Puestos_Postulante_Puestos]
GO
ALTER TABLE [dbo].[ReferenciasLaborales]  WITH CHECK ADD  CONSTRAINT [FK_ReferenciasLaborales_Postulante1] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[ReferenciasLaborales] CHECK CONSTRAINT [FK_ReferenciasLaborales_Postulante1]
GO
ALTER TABLE [dbo].[Sesiones]  WITH CHECK ADD  CONSTRAINT [FK_Sesiones_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([IdUsuario])
GO
ALTER TABLE [dbo].[Sesiones] CHECK CONSTRAINT [FK_Sesiones_Usuario]
GO
ALTER TABLE [dbo].[Titulos]  WITH CHECK ADD  CONSTRAINT [FK_Titulos_Postulante] FOREIGN KEY([IdPostulante])
REFERENCES [dbo].[Postulante] ([IdPostulante])
GO
ALTER TABLE [dbo].[Titulos] CHECK CONSTRAINT [FK_Titulos_Postulante]
GO
ALTER TABLE [dbo].[Usuario]  WITH CHECK ADD  CONSTRAINT [FK_Usuario_TipoLogin] FOREIGN KEY([IdTipoLogin])
REFERENCES [dbo].[TipoLogin] ([IdTipoLogin])
GO
ALTER TABLE [dbo].[Usuario] CHECK CONSTRAINT [FK_Usuario_TipoLogin]
GO
ALTER TABLE [dbo].[Usuario_Roles]  WITH CHECK ADD  CONSTRAINT [FK_Usuario_Roles_Roles] FOREIGN KEY([IdRol])
REFERENCES [dbo].[Roles] ([IdRol])
GO
ALTER TABLE [dbo].[Usuario_Roles] CHECK CONSTRAINT [FK_Usuario_Roles_Roles]
GO
ALTER TABLE [dbo].[Usuario_Roles]  WITH CHECK ADD  CONSTRAINT [FK_Usuario_Roles_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([IdUsuario])
GO
ALTER TABLE [dbo].[Usuario_Roles] CHECK CONSTRAINT [FK_Usuario_Roles_Usuario]
GO
ALTER TABLE [dbo].[Zona_Bac]  WITH CHECK ADD  CONSTRAINT [FK_Zona_Paises] FOREIGN KEY([IdPais])
REFERENCES [dbo].[Paises_Bac] ([IdPais])
GO
ALTER TABLE [dbo].[Zona_Bac] CHECK CONSTRAINT [FK_Zona_Paises]
GO
ALTER TABLE [dbo].[Zona2]  WITH CHECK ADD  CONSTRAINT [FK_Canton_Provincia] FOREIGN KEY([IdZona1])
REFERENCES [dbo].[Zona1] ([IdZona1])
GO
ALTER TABLE [dbo].[Zona2] CHECK CONSTRAINT [FK_Canton_Provincia]
GO
ALTER TABLE [dbo].[Zona3]  WITH CHECK ADD  CONSTRAINT [FK_Distrito_Canton] FOREIGN KEY([IdZona2])
REFERENCES [dbo].[Zona2] ([IdZona2])
GO
ALTER TABLE [dbo].[Zona3] CHECK CONSTRAINT [FK_Distrito_Canton]
GO
USE [master]
GO
ALTER DATABASE [bac2_db] SET  READ_WRITE 
GO
