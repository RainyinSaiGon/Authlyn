# Logging

This document defines logging conventions and observability basics.

## Logging Goals

- Structured logs for backend services
- Stable event names across releases
- Redaction of sensitive fields

## Minimum Fields

- Timestamp
- Severity
- Service/component name
- Correlation/request ID
- Event name

## TODO

- Define full log schema and examples
- Document redaction rules per data class
- Add links to metrics and tracing strategy
