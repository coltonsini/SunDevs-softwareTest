import { Injectable } from '@nestjs/common';
import * as rawVideos from './mock-youtube-api.json';

interface RawVideoStats {
  viewCount: string;
  likeCount: string;
  commentCount?: string;
}

interface RawVideoSnippet {
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    high: {
      url: string;
    };
  };
}

interface RawVideo {
  id: string;
  snippet: RawVideoSnippet;
  statistics: RawVideoStats;
}

export interface CleanVideo {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  publishedAt: string;
  hypeLevel: number;
}

@Injectable()
export class VideosService {
  // ─────────────────────────────────────────────
  // MÉTODO PRINCIPAL: El "colador"
  // ─────────────────────────────────────────────

  getVideos(): CleanVideo[] {
    const videos = (rawVideos as { items: RawVideo[] }).items;

    return videos.map((video) => ({
      id: video.id,
      title: video.snippet.title,
      author: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: this.getRelativeTime(video.snippet.publishedAt),
      hypeLevel: this.calculateHype(video),
    }));
  }

  // ─────────────────────────────────────────────
  // REGLA DE NEGOCIO: Cálculo del Nivel de Hype
  // ─────────────────────────────────────────────

  private calculateHype(video: RawVideo): number {
    const { viewCount, likeCount, commentCount } = video.statistics;

    const views = Number(viewCount);
    const likes = Number(likeCount);
    const comments = commentCount ? Number(commentCount) : undefined;

    if (comments === undefined || views === 0) {
      return 0;
    }

    let hype = (likes + comments) / views;
    hype = Math.round(hype * 10000) / 10000;

    if (video.snippet.title.toLowerCase().includes('tutorial')) {
      hype *= 2;
    }

    return hype;
  }

  // ─────────────────────────────────────────────
  // UTILIDAD: Fecha relativa SIN librerías externas
  // Solo JavaScript nativo (Date)
  // ─────────────────────────────────────────────

  private getRelativeTime(isoDate: string): string {
    const publishedDate = new Date(isoDate);
    const now = new Date();

    const diffMs = now.getTime() - publishedDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const WEEK = DAY * 7;
    const MONTH = DAY * 30;
    const YEAR = DAY * 365;

    if (diffSeconds < MINUTE) return 'Hace unos segundos';
    if (diffSeconds < HOUR)
      return `Hace ${Math.floor(diffSeconds / MINUTE)} minutos`;
    if (diffSeconds < DAY)
      return `Hace ${Math.floor(diffSeconds / HOUR)} horas`;
    if (diffSeconds < WEEK) return `Hace ${Math.floor(diffSeconds / DAY)} días`;
    if (diffSeconds < MONTH)
      return `Hace ${Math.floor(diffSeconds / WEEK)} semanas`;
    if (diffSeconds < YEAR)
      return `Hace ${Math.floor(diffSeconds / MONTH)} meses`;

    return `Hace ${Math.floor(diffSeconds / YEAR)} años`;
  }
}
