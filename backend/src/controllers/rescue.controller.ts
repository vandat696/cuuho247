import { Request, Response, NextFunction } from 'express';
import rescueService from '../services/rescue.service';

class RescueController {
  /**
   * GET /api/rescue/companies
   * Query params: lat, lng, incident_type, max_distance_km
   */
  async searchCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lat, lng, incident_type, max_distance_km } = req.query;

      if (!lat || !lng) {
        res.status(400).json({
          status: 'error',
          message: 'Vị trí (lat, lng) là bắt buộc',
        });
        return;
      }

      const results = await rescueService.searchNearbyCompanies({
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        incident_type: incident_type as string,
        max_distance_km: max_distance_km ? parseFloat(max_distance_km as string) : undefined,
      });

      res.status(200).json({
        status: 'success',
        data: {
          total: results.length,
          companies: results,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RescueController();
