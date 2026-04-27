import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { VideosService } from './videos.service';

@ApiTags('Videos')
@ApiSecurity('x-api-key')
@Controller('videos')
export class VideosController {

  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener cartelera de videos',
    description:
      'Devuelve la lista de videos transformada: miniatura, título, autor, fecha relativa y Nivel de Hype calculado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de videos ordenada por Hype descendente.',
  })
  @ApiResponse({
    status: 401,
    description: 'API key ausente o inválida.',
  })
  getVideos() {
    return this.videosService.getVideos();
  }
}