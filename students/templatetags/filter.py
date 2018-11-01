from django import template
register = template.Library()

# @register.filter(name='grade_alphabet')
# def grade_alphabet(value):
#     if value is None or value == '':
#         return ''
#     if value >= 4.00:
#         return 'A'
#     elif value > 3.33 and value <= 3.67:
#         return 'A-'
#     elif value > 3.0 and value <= 3.33:
#         return 'B+'
#     elif value > 2.67 and value <= 3.0:
#         return 'B'
#     elif value > 2.33 and value <= 2.67:
#         return 'B-'
#     elif value > 2.0 and value <= 2.33:
#         return 'C+'
#     elif value > 1.67 and value <= 2.0:
#         return 'C'
#     elif value > 1.33 and value <= 1.67:
#         return 'C-'
#     elif value > 1.0 and value <= 1.33:
#         return 'D+'
#     elif value > 0.67 and value <= 1.0:
#         return 'D'
#     elif value > 0.0 and value <= 0.67:
#         return 'D-'
#     else:
#         return 'F'

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

@register.filter(name='grade_number')
def grade_number(value):
    if value is None or value == '':
        return ''
    return value


def grade_convert_alphabet_to_number(value):
    if value == "A":
        return 95.00
    elif value == "A-":
        return 91.25
    elif value == "B+":
        return 88.75
    elif value == "B":
        return 85.00
    elif value == "B-":
        return 81.25
    elif value == "C+":
        return 78.75
    elif value == "C":
        return 75.00
    elif value == "C-":
        return 71.25
    elif value == "D+":
        return 68.75
    elif value == "D":
        return 65.00
    elif value == "D-":
        return 61.25
    elif value == "F":
        return 55.00