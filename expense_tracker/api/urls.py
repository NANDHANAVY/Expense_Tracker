from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import * # Import your views here
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'budgets', BudgetViewSet)
router.register(r'records', RecordViewSet)



urlpatterns = [
    path('api/', include(router.urls)),
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('records/create/', views.create_record), 
    path("records/list/", views.get_records),
    path('records/update/<int:record_id>/', views.update_record),
    path('records/delete/', views.delete_record),
    path('budgets/create/', views.create_budget),
    path('budgets/', views.get_budgets),
    path('budgets/update/<int:budget_id>/', views.update_budget),
    path('budgets/delete/', views.delete_budget),
    path('auth/change-password/', views.change_password),
    path('auth/change-username/', views.change_username),
    path('budgets/last-update/', views.last_budget_update, name='last-budget-update')
]
