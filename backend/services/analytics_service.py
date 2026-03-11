from repositories.analytics_repository import AnalyticsRepository


class AnalyticsService:

    def __init__(self):
        self.repo = AnalyticsRepository()

    def get_summary(self, user_id: str):
        return self.repo.get_summary(user_id)
    
    def weekly_study(self, user_id):
        return self.repo.get_weekly_study(user_id)

    def focus_trend(self, user_id):
        return self.repo.get_focus_trend(user_id)

    def weak_topics(self):
        return self.repo.get_weak_topics()