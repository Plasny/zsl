from flask import Flask, render_template, request
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'aas3AEDTo2ih*3(*Fha23bjkvo_-bk'

class sequenceForm(FlaskForm):
    sequence = StringField('Wpisz ciąg liczb (po przecinku)', validators=[DataRequired()])
    submit = SubmitField('Wyślij')

@app.route('/', methods=['GET', 'POST'])
def index():
    userForm = sequenceForm()
    sequence = userForm.sequence.data
    if sequence is not None:
        arr = sequence.split(",")
        avrS = 0
        # for i in range(0, len(arr)):
        #     print(type(arr[i]))
        #     print(type(int(arr[i])))
        for i in range(0, len(arr)):
            for j in range(i+1, len(arr)):    
                if(int(arr[i]) < int(arr[j])):
                    temp = int(arr[i]);    
                    arr[i] = int(arr[j]);    
                    arr[j] = temp;   

        for i in range(len(arr)):
            avrS += arr[i]

        avrS = avrS / (len(arr))
        maxS = arr[0]
        minS = arr[len(arr)-1]

        return render_template('index.html.j2', title='Operacjena ciągu', userForm=userForm, min=minS, max=maxS, avr=avrS, sequence=arr)
    return render_template('index.html.j2', title='Podaj ciąg', userForm=userForm)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)
