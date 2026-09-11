import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] caught", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 48 }}>💥</Text>
          <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 12 }}>Something farted wrong</Text>
          <Text style={{ color: "#666", textAlign: "center", marginTop: 8 }}>{this.state.error?.message}</Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: undefined })}
            style={{ backgroundColor: "#000", padding: 12, borderRadius: 8, marginTop: 16 }}
          >
            <Text style={{ color: "#fff" }}>Try again</Text>
          </TouchableOpacity>
          <Text style={{ color: "#999", fontSize: 11, marginTop: 16, textAlign: "center" }}>
            Tiny, single-purpose product — resist feature creep. Check logs for "does this serve the fart notification?"
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
