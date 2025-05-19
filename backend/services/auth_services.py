from flask import Blueprint, request, jsonify, make_response
import jwt
import datetime
import os

TOKEN_KEY = os.getenv('SECRET_TOKEN_KEY')

def create_jwt_token(user_id):
    """
    Create a JWT token for the user.
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = jwt.encode(payload, TOKEN_KEY , algorithm='HS256')
    return token


def decode_jwt_token(token):
    """
    Decode the JWT token to get the user ID.
    """
    try:
        payload = jwt.decode(token, TOKEN_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None