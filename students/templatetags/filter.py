from django import template
register = template.Library()

@register.filter(name='grade_alphabet')
def grade_alphabet(value):
    if value is None or value == '':
        return ''
    if value >= 4.00:
        return 'A'
    elif value > 3.33 and value <= 3.67:
        return 'A-'
    elif value > 3.0 and value <= 3.33:
        return 'B+'
    elif value > 2.67 and value <= 3.0:
        return 'B'
    elif value > 2.33 and value <= 2.67:
        return 'B-'
    elif value > 2.0 and value <= 2.33:
        return 'C+'
    elif value > 1.67 and value <= 2.0:
        return 'C'
    elif value > 1.33 and value <= 1.67:
        return 'C-'
    elif value > 1.0 and value <= 1.33:
        return 'D+'
    elif value > 0.67 and value <= 1.0:
        return 'D'
    elif value > 0.0 and value <= 0.67:
        return 'D-'
    else:
        return 'F'

@register.filter(name='grade_number')
def grade_number(value):
    if value is None or value == '':
        return ''
    return value