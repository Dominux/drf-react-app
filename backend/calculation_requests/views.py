from rest_framework.views import APIView
from .utils import CheatResponse
from django.contrib.auth.models import User
from datetime import datetime
import json

from .serializers import *
from .models import *


class UsersList(APIView):
    """
        Список всех пользователей
    """

    def get(self, request):
        """
            Возвращает список всех пользователей
        """
        users = User.objects.all()
        serializer = UserSerrializer(users, many=True)
        return CheatResponse(serializer.data)


class RequestsList(APIView):
    """
        Список всех запросов
    """

    def get(self, request):
        """
            Возвращает список всех запросов с возможностью фильтрации по статусу
        """
        status = request.query_params.items()
        params = {f'status__{field}': json.loads(val) for (field, val) in status}
        requests = Request.objects.filter(**params)
        serializer = RequestSerializer(data=[ 
            { 
                'id': r.id,
                'name': r.name,
                'positionName': r.content.position_name,
                'OCPD2Code': r.content.OCPD2_code,
                'OKEYCode': r.content.OKEY_code,
                'unitsCount': r.content.units_count,
                'createdDate': r.created_date,
                'last_date_of_report_providing': r.last_date_of_report_providing
            } for r in requests
        ], many=True)
        return CheatResponse(serializer.initial_data)

    def post(self, request):
        """
            Создаем запрос
        """
        serializer = RequestCreatingSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            # 1. Создаем объект контента запроса
            req_content = RequestContent.objects.create(
                position_name=serializer.data.get('positionName'),
                OCPD2_code=serializer.data.get('OCPD2Code'),
                OKEY_code=serializer.data.get('OKEYCode'),
                units_count=serializer.data.get('unitsCount'),
            )
            # 2. Создаем объект статуса
            status = ChangingStatus.objects.create()
            # 3. Создаем объект истории изменений
            changing_history = ChangingHistory.objects.create(
                changing_status=status,
                worker=User.objects.get(pk=serializer.data.get('workerId'))
            )
            # 4. Создаем объект запроса
            req = Request.objects.create(
                name=serializer.data.get('name'),
                content=req_content,
                last_date_of_report_providing=serializer.data.get('lastDateOfReportProviding'),
                status=changing_history
            )
            # 5. Сохраняем ссылку в модели истории изменений на запрос
            changing_history.request = req
            changing_history.save()

            return CheatResponse(f"Запрос {req.name} успешно составлен")

        return CheatResponse("Самфинг уэнт ронг", status=400)


class RequestCalculations(APIView):
    """
        Список всех расчетов к запросу
    """

    def get(self, request):
        request_name = request.GET.get('request_name', None)
        calculations = Request.objects.filter(name=request_name)\
            .last().calculation
        return CheatResponse(calculations)
        