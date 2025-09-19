#!/bin/bash

echo "🧪 Testando endpoint do Planning Poker..."
echo "🔗 URL: https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub"
echo ""

# Testar se o endpoint está acessível
echo "📡 Testando conectividade HTTP..."
response=$(curl -s -o /dev/null -w "%{http_code}" "https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub")

if [ "$response" = "200" ] || [ "$response" = "101" ] || [ "$response" = "426" ]; then
    echo "✅ Endpoint está acessível! (HTTP $response)"
else
    echo "❌ Endpoint retornou HTTP $response"
fi

echo ""
echo "🔍 Testando negociação SignalR..."
curl -s -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     "https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub/negotiate" \
     | jq . 2>/dev/null || echo "❌ Falha na negociação ou jq não instalado"

echo ""
echo "📊 Informações de conectividade:"
curl -s -I "https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub" | head -10

echo ""
echo "💡 Para testar WebSocket completo, execute:"
echo "   node test-websocket.js"
