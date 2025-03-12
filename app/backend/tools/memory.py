import re
from typing import Any

from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential
from azure.search.documents.aio import SearchClient
from azure.search.documents.models import VectorizableTextQuery

from rtmt import RTMiddleTier, Tool, ToolResult, ToolResultDirection
import json

_remember_tool_schema = {
    "type": "function",
    "name": "remember",
    "description": "Remember a fact for future use. The fact is a key-value pair, where the key is a string and the value is a string. ",
    "parameters": {
        "type": "object",
        "properties": {
            "key": {
                "type": "string",
                "description": "The key under which to remember the value."
            },
            "value": {
                "type": "string",
                "description": "The value to remember."
            },
        },
        "required": ["key", "value"],
        "additionalProperties": False
    }
}

_recall_tool_schema = {
    "type": "function",
    "name": "recall",
    "description": "Recall a fact that was remembered. The fact is a key-value pair, where the key is a string and the value is a string. ",
    "parameters": {
        "type": "object",
        "properties": {
            "key": {
                "type": "string",
                "description": "The key under which the value was remembered."
            },
        },
        "required": ["key"],
        "additionalProperties": False
    }
}

async def _remember_tool(
    memory: dict,
    args: Any) -> ToolResult:

    key = args['key']
    value = args['value']
    print(f"Remember '{key} -> {value}'")
    memory[key] = value

    result = json.dumps({
        "action": "remembered",
        "key": key,
        "value": value
    })
    return ToolResult(result, ToolResultDirection.TO_SERVER)

async def _recall_tool(
    memory: dict,
    args: Any) -> ToolResult:

    key = args['key']
    print(f"Recall '{key}'")
    value = memory.get(key, "I don't remember that.")

    result = json.dumps({
        "action": "recalled",
        "key": key,
        "value": value
    })
    return ToolResult(result, ToolResultDirection.TO_SERVER)

def memory_tools() -> dict[str, Tool]:
    memory = {}
    return {
        "remember": Tool(schema=_remember_tool_schema, target=lambda args: _remember_tool(memory, args)),
        "recall": Tool(schema=_recall_tool_schema, target=lambda args: _recall_tool(memory, args))
    }
