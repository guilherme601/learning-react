import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# O CORS permite que o seu Front-end (React) converse com este Back-end
CORS(app)

# Caminho do nosso "banco de dados" simples (um arquivo JSON)
DB_FILE = os.path.join(os.path.dirname(__file__), 'tasks.json')

def load_tasks():
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except:
            return []

def save_tasks(tasks):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, indent=4, ensure_ascii=False)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    """Retorna todas as tarefas salvas no arquivo JSON"""
    return jsonify(load_tasks())

@app.route('/tasks', methods=['POST'])
def add_task():
    """Adiciona uma nova tarefa ao arquivo JSON"""
    new_task = request.json
    tasks = load_tasks()
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Remove uma tarefa pelo ID"""
    tasks = load_tasks()
    tasks = [t for t in tasks if t['id'] != task_id]
    save_tasks(tasks)
    return '', 204

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Atualiza o status de uma tarefa"""
    data = request.json
    tasks = load_tasks()
    for t in tasks:
        if t['id'] == task_id:
            t['status'] = data.get('status', t['status'])
            break
    save_tasks(tasks)
    return jsonify(data)

if __name__ == '__main__':
    print("Servidor rodando em http://localhost:5000")
    app.run(debug=True, port=5000)
