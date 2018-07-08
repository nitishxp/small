from django import template
register = template.Library()

@register.filter(name='grade_alphabet')
def grade_alphabet(value):
    if value is None or value == '':
        return ''
    if value > 92:
        return 'A'
    elif value >= 90 and value <= 92:
        return 'A-'
    elif value >= 87 and value <= 89:
        return 'B+'
    elif value >= 83 and value <= 86:
        return 'B'
    elif value >= 80 and value <= 82:
        return 'B-'
    elif value >= 77 and value <= 79:
        return 'C+'
    elif value >= 73 and value <= 76:
        return 'C'
    elif value >= 70 and value <= 72:
        return 'C-'
    elif value >= 67 and value <= 69:
        return 'D+'
    elif value >= 63 and value <= 66:
        return 'D'
    elif value >= 60 and value <= 62:
        return 'D-'
    else:
        return 'F'