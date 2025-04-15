# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#from rest_framework.exceptions import ValidationError
#import PyPDF2
#import docx2txt
#import io
from celery.result import AsyncResult
from .utils import extract_text, calculate_ats_score
from .tasks import async_extract_and_score

class ResumeParseView(APIView):
    def post(self, request):
        try:
            # Validate file exists and is within size limit
            if 'resume' not in request.FILES:
                raise Exception("No file uploaded")
            
            file = request.FILES['resume']
            if file.size > 5 * 1024 * 1024:  # 5MB
                raise Exception("File too large (max 5MB)")
            
            # Read file content into memory
            file_bytes = file.read()

            if file.size > 2 * 1024 * 1024:  # Example: 2MB+ → async
                task = async_extract_and_score.delay(file_bytes, file.name)
                res_status = 2
                data = {
                    'task_id': task.id,
                    'status': 'Processing',
                }
                #return Response({'task_id': task.
            else:
                result = extract_text(file_bytes, file.name)
                if result['status'] == 0:
                    raise Exception(result['message'])
                
                text = result['text']
                ats_score = calculate_ats_score(text)
                res_status = 1
                data = {
                        'text': text,
                        'ats_score': ats_score,
                        'file_metadata': {
                            'name': file.name,
                            'size': file.size,
                            'type': file.content_type
                        }
                }
            return Response({'status': res_status, 'data': data, 'message':'success'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            error = str(e)
            return Response({'status': 0, 'message': error}, status=status.HTTP_400_BAD_REQUEST)
        
class TaskStatusView(APIView):
    def get(self, request, task_id):
        task = AsyncResult(task_id)

        if task.state == 'PENDING':
            status = 2
            message = 'Still Processing'
        elif task.state == 'SUCCESS':
            status = 1
            message = 'Task Completed'
        elif task.state == 'FAILURE':
            status = 0
            message = 'Task Failed'
        
        data = {
            'task_id': task_id,
            'status': task.status,
            'result': task.result if task.ready() else None
        }
        
        return Response({'status': status, 'data': data, 'message': message}, status=status.HTTP_200_OK)

    