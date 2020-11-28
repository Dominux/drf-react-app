from rest_framework.response import Response


# Возникли проблемы с django-cors-headers, так что:
class CheatResponse(Response):
    def __init__(self, data, **kwargs):
        super().__init__(data, **kwargs)
        self['Access-Control-Allow-Origin'] = "*"

