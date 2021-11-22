class Response:
    def __init__(self, _status):
        self.status = _status
        self.msg = ''
        self.id = -1

    def toJson(self):
        return {"Status": self.status, "Message": self.msg, "Id": self.id}

    @staticmethod
    def Ok(_id):
        response = Response('ok')
        response.id = _id

        return response.toJson()

    @staticmethod
    def Error(_msg):
        response = Response('error')
        response.msg = _msg

        return response.toJson()

