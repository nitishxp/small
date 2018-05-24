# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from models import Constraints
from django.db import IntegrityError

# Create your views here.


def index(request):

    constraints = [{
        'title':
        'Weekend Meetings',
        'options': [{
            'value':
            'No',
            'content':
            'I have no time for team activity during the weekend'
        }, {
            'value':
            'Avoid',
            'content':
            'I would prefer to avoid working with my team during the weekend'
        }, {
            'value': 'Ok',
            'content': 'The weekend is as good as any other time'
        }, {
            'value':
            'Prefer',
            'content':
            'Weekends are the best time for me to meet with my team'
        }],
        'input_type':
        'checkbox',
        'question':
        "How willing are you to participate in team activities on the weekend?"
    }, {
        'title':
        'Leadership Role',
        'options': [{
            'value':
            'Follower',
            'content':
            'Strongly prefer to be a follower rather than a leader'
        }, {
            'value':
            'Pref Following',
            'content':
            'Prefer to be a follower, but will lead when necessary'
        }, {
            'value': 'Balanced',
            'content': 'Enjoy leading and following equally'
        }, {
            'value':
            'Prefer Leading',
            'content':
            'Prefer to be a leader, but will follow when necessary'
        }, {
            'value':
            'Leader',
            'content':
            'Strongly prefer to be the leader; do not enjoy being a follower'
        }],
        'input_type':
        'checkbox',
        'question':
        "What is your preferred leadership role?"
    }, {
        'title':
        'Software Skills',
        'options': [{
            'value': 'None',
            'content': 'Never used it before'
        }, {
            'value': 'Basic',
            'content': 'Some experience, basic skills'
        }, {
            'value': 'Good',
            'content': 'Lots of experience, basic skills'
        }, {
            'value': 'Expert',
            'content': 'Lots of experience, advanced skills'
        }],
        'input_type':
        'checkbox',
        'question':
        "Your ability to use <supplied by instructor> is"
    }, {
        'title':
        'English Skills',
        'options': [{
            'value': 'Very Comfortable',
            'content': 'Very Comfortable'
        }, {
            'value': 'Comfortable',
            'content': 'Some experience, basic skills'
        }, {
            'value': 'Uncomfortable',
            'content': 'Uncomfortable'
        }, {
            'value': 'Very Uncomfortable',
            'content': 'Very Uncomfortable'
        }],
        'input_type':
        'checkbox',
        'question':
        "Please rate your facility with the English language"
    }, {
        'title':
        'Writing Skills',
        'options': [{
            'value': 'None',
            'content': 'Need Improvement'
        }, {
            'value': 'Basic',
            'content': 'Marginal'
        }, {
            'value': 'Average',
            'content': 'Average'
        }, {
            'value': 'Good',
            'content': 'Above Average'
        }, {
            'value': 'Expert',
            'content': 'Exceptional'
        }],
        'input_type':
        'checkbox',
        'question':
        "Rate your writing skills"
    }, {
        'title':
        'Hands-On Skills',
        'options': [{
            'value': 'None',
            'content': 'Need Improvement'
        }, {
            'value': 'Basic',
            'content': 'Marginal'
        }, {
            'value': 'Average',
            'content': 'Average'
        }, {
            'value': 'Good',
            'content': 'Above Average'
        }, {
            'value': 'Expert',
            'content': 'Exceptional'
        }],
        'input_type':
        'checkbox',
        'question':
        "Rate your skill with hands-on build or repair tasks"
    }, {
        'title':
        'Commitment Level',
        'options': [{
            'value': '1',
            'content': '1 hour per week'
        }, {
            'value': '2',
            'content': '2-4 hours per week'
        }, {
            'value': '5',
            'content': '5-7 hours per week'
        }, {
            'value': '8',
            'content': '8-10 hours per week'
        }, {
            'value': '11',
            'content': 'Whatever it takes'
        }],
        'input_type':
        'checkbox',
        'question':
        "In this course, you intend to work how many hours per week outside of class (not counting lectures or labs)"
    }, {
        'title':
        'Schedule',
        'options': [{
            'value': 'monday',
            'content': 'Monday'
        }, {
            'value': 'tuesday',
            'content': 'Tuesday'
        }, {
            'value': 'wednesday',
            'content': 'Wednesday'
        }, {
            'value': 'thursday',
            'content': 'Thursday'
        }, {
            'value': 'friday',
            'content': 'Friday'
        }, {
            'value': 'saturday',
            'content': 'Saturday'
        }, {
            'value': 'sunday',
            'content': 'Sunday'
        }],
        'input_type':
        'checkbox',
        'question':
        "Please check ONE day that you want to do group work"
    }]

    for c in constraints:
        try:
            constraints_obj = Constraints()
            constraints_obj.title = c['title']
            constraints_obj.input_type = c['input_type']
            constraints_obj.question = c['question']
            constraints_obj.options = c['options']
            constraints_obj.save()
        except IntegrityError as e:
            constraints_obj = Constraints.objects.get(title=c['title'])
            constraints_obj.input_type = c['input_type']
            constraints_obj.question = c['question']
            constraints_obj.options = c['options']
            constraints_obj.save()

    return HttpResponse('saved')
