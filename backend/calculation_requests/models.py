from django.db import models
from django.contrib.auth.models import User


class RequestContent(models.Model):
    position_name = models.CharField('Наименование позиции', max_length=200)
    OCPD2_code = models.CharField('Код ОКПД2', max_length=15)
    OKEY_code = models.DecimalField('Код ОКЕИ', max_digits=3, decimal_places=0)
    units_count = models.IntegerField('Количество единиц')
    
    class Meta:
        verbose_name = 'Содержание запроса'
        verbose_name_plural = 'Содержания запросов'


class Request(models.Model):
    name = models.CharField('Наименовние запроса', max_length=149)
    content = models.OneToOneField(verbose_name='Содержание запроса', to=RequestContent, on_delete=models.CASCADE)
    created_date = models.DateField('Дата создания запроса', auto_now=True)
    last_date_of_report_providing = models.DateField('Дата крайнего срока предоставления отчета')
    status = models.OneToOneField('calculation_requests.ChangingHistory', verbose_name='Статус', 
        on_delete=models.PROTECT, related_name='parent_request')

    class Meta:
        verbose_name = 'Запрос'
        verbose_name_plural = 'Запросы'

    def __str__(self) -> str:
        return self.name


class ChangingStatus(models.Model):
    created_date = models.DateField('Создан', auto_now=True)
    is_got_to_work = models.BooleanField('Принят в работу Исполнителем', default=False)
    is_request_formed = models.BooleanField('Сформирован расчет', default=False)
    is_brought_back_to_worker = models.BooleanField('Возвращен исполнителю', default=False)
    is_worker_outta_invoice = models.BooleanField('Исполнитель с расчета снят', default=False)
    is_overtime = models.BooleanField('Просрочен', default=False)

    class Meta:
        verbose_name = 'Статус изменения'
        verbose_name_plural = 'Статусы изменения'


class ChangingHistory(models.Model):
    request = models.ForeignKey(verbose_name='Запрос', to=Request, 
        on_delete=models.CASCADE, null=True, blank=True)
    created_date = models.DateField('Дата создания записи', auto_now=True)
    changing_status = models.OneToOneField(verbose_name='Статус изменения ',
        to=ChangingStatus, on_delete=models.CASCADE)
    worker = models.ForeignKey(verbose_name='Исполнитель', to=User, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'История изменений'
        verbose_name_plural = 'Истории изменений'


class Calculation(models.Model):
    request = models.ForeignKey(verbose_name='Запрос', to=Request, on_delete=models.CASCADE)
    worker = models.ForeignKey(verbose_name='Исполнитель', to=User, on_delete=models.PROTECT)
    created_date = models.DateField('Дата создания расчета', auto_now=True)

    class Meta:
        verbose_name = 'Расчет'
        verbose_name_plural = 'Расчеты'

    def __str__(self) -> str:
        return f'Расчет от {self.created_date}'


class UnitPosition(models.Model):
    calculation = models.ForeignKey(verbose_name='Расчет', to=Calculation, on_delete=models.CASCADE)
    position = models.ForeignKey(verbose_name='Позиция', to=RequestContent, on_delete=models.CASCADE)
    price = models.FloatField('Цена')

    class Meta:
        verbose_name = 'Позиция расчета'
        verbose_name_plural = 'Позиции расчета'

