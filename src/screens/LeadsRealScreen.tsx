/**
 * Leads Real Screen
 *
 * Connected to real backend data for Rovi Pocket app.
 * Shows actual leads from the CRM with filtering and search.
 */

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { palette, spacing } from "../theme";
import { usePocketAuth } from "../context/PocketAuthContext";
import {
  fetchLeads,
  fetchLeadDetail,
  type ApiLead,
  PocketApiError,
} from "../lib/pocketApi";
import { LeadCard, SectionCard, SectionHeading } from "../components/ui";

interface LeadsRealScreenProps {
  onLeadPress: (leadId: string) => void;
  onAskAI: (leadId: string) => void;
  selectedLeadId: string | null;
}

export function LeadsRealScreen({
  onLeadPress,
  onAskAI,
  selectedLeadId,
}: LeadsRealScreenProps) {
  const { token } = usePocketAuth();

  // State for leads data
  const [leads, setLeads] = useState<ApiLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<ApiLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<ApiLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // Load leads on mount
  useEffect(() => {
    if (token) {
      loadLeads();
    }
  }, [token]);

  // Filter leads based on search and filters
  useEffect(() => {
    let filtered = [...leads];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter((lead) => lead.pocket_priority === priorityFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchQuery, statusFilter, priorityFilter]);

  // Load selected lead detail
  useEffect(() => {
    if (selectedLeadId && token) {
      loadLeadDetail(selectedLeadId);
    }
  }, [selectedLeadId, token]);

  const loadLeads = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const leadsData = await fetchLeads(token);
      setLeads(leadsData);
    } catch (err) {
      console.error("Error loading leads:", err);

      let errorMessage = "Error al cargar leads";

      if (err instanceof PocketApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeadDetail = async (leadId: string) => {
    if (!token) return;

    try {
      setIsLoadingDetail(true);
      const leadDetail = await fetchLeadDetail(token, leadId);
      setSelectedLead(leadDetail);
    } catch (err) {
      console.error("Error loading lead detail:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleLeadPress = (leadId: string) => {
    onLeadPress(leadId);
  };

  const handleFilterPress = (filterType: "status" | "priority", value: string | null) => {
    if (filterType === "status") {
      setStatusFilter(statusFilter === value ? null : value);
    } else {
      setPriorityFilter(priorityFilter === value ? null : value);
    }
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setSearchQuery("");
  };

  const activeFiltersCount = [statusFilter, priorityFilter].filter(Boolean).length;

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Cargando leads...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadLeads}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <SectionCard style={styles.searchCard}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, email o teléfono..."
          placeholderTextColor={palette.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {activeFiltersCount > 0 && (
          <View style={styles.activeFiltersRow}>
            <Text style={styles.activeFiltersText}>
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} activo
              {activeFiltersCount > 1 ? "s" : ""}
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filterSectionTitle}>Estado</Text>
          <View style={styles.filterButtonsRow}>
            {["nuevo", "contactado", "calificacion", "presentacion", "apartado"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  statusFilter === status && styles.filterButtonActive,
                ]}
                onPress={() => handleFilterPress("status", status)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    statusFilter === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filterSectionTitle}>Prioridad</Text>
          <View style={styles.filterButtonsRow}>
            {["hot", "warm", "cold", "stale"].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.filterButton,
                  priorityFilter === priority && styles.filterButtonActive,
                ]}
                onPress={() => handleFilterPress("priority", priority)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    priorityFilter === priority && styles.filterButtonTextActive,
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SectionCard>

      {/* Results Summary */}
      <SectionCard style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          Mostrando {filteredLeads.length} de {leads.length} leads
        </Text>
      </SectionCard>

      {/* Leads List */}
      <ScrollView style={styles.leadsList} contentContainerStyle={styles.leadsListContent}>
        {filteredLeads.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No se encontraron leads</Text>
            <Text style={styles.emptyStateText}>
              Intenta ajustar los filtros o la búsqueda
            </Text>
          </View>
        ) : (
          filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              name={lead.name}
              property={lead.property_interest || "Sin especificar"}
              score={lead.intent_score || 0}
              lastTouch={
                lead.last_contact
                  ? new Date(lead.last_contact).toLocaleDateString("es-MX")
                  : "Nunca"
              }
              status={lead.status || "nuevo"}
              onPress={() => handleLeadPress(lead.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Selected Lead Detail Panel */}
      {selectedLead && (
        <View style={styles.detailPanel}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selectedLead.name}</Text>
            <TouchableOpacity onPress={() => setSelectedLead(null)}>
              <Text style={styles.detailClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailContent}>
            {/* Contact Info */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Contacto</Text>
              {selectedLead.email && (
                <Text style={styles.detailText}>📧 {selectedLead.email}</Text>
              )}
              {selectedLead.phone && (
                <Text style={styles.detailText}>📱 {selectedLead.phone}</Text>
              )}
            </View>

            {/* Property Info */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Propiedad</Text>
              {selectedLead.property_interest && (
                <Text style={styles.detailText}>
                  🏠 {selectedLead.property_interest}
                </Text>
              )}
              {selectedLead.location_preference && (
                <Text style={styles.detailText}>
                  📍 {selectedLead.location_preference}
                </Text>
              )}
              {selectedLead.budget_mxn && (
                <Text style={styles.detailText}>
                  💰 ${(selectedLead.budget_mxn / 1000000).toFixed(1)}M MXN
                </Text>
              )}
            </View>

            {/* AI Analysis */}
            {selectedLead.ai_analysis && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Análisis IA</Text>
                <Text style={styles.detailText}>
                  Score: {selectedLead.intent_score || 0}/100
                </Text>
                {selectedLead.next_action && (
                  <Text style={styles.detailText}>
                    ➡️ {selectedLead.next_action}
                  </Text>
                )}
              </View>
            )}

            {/* Notes */}
            {selectedLead.notes && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Notas</Text>
                <Text style={styles.detailText}>{selectedLead.notes}</Text>
              </View>
            )}

            {/* Timeline */}
            {selectedLead.timeline && selectedLead.timeline.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Actividad Reciente</Text>
                {selectedLead.timeline.slice(0, 5).map((item, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <Text style={styles.timelineType}>
                      {item.type === "activity" ? "📝" : "📅"}
                    </Text>
                    <Text style={styles.timelineText}>{item.description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.detailActions}>
              <TouchableOpacity
                style={styles.detailActionButton}
                onPress={() => onAskAI(selectedLead.id)}
              >
                <Text style={styles.detailActionText}>🤖 Pedir Script IA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.detailActionButton, styles.detailActionButtonSecondary]}
                onPress={() => {
                  // Call action
                  if (selectedLead.phone) {
                    // Would open phone dialer
                    console.log("Calling:", selectedLead.phone);
                  }
                }}
              >
                <Text style={styles.detailActionText}>📞 Llamar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    color: palette.textPrimary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    color: palette.error,
    fontSize: 20,
    fontWeight: "bold",
  },
  errorText: {
    color: palette.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  searchCard: {
    margin: spacing.md,
  },
  searchInput: {
    backgroundColor: "#1a1a1a",
    color: palette.textPrimary,
    fontSize: 16,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  activeFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  activeFiltersText: {
    color: palette.textSecondary,
    fontSize: 14,
  },
  clearFiltersText: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  filterSectionTitle: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  filterButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  filterButton: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  filterButtonText: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  summaryCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryText: {
    color: palette.textSecondary,
    fontSize: 14,
  },
  leadsList: {
    flex: 1,
  },
  leadsListContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  emptyStateText: {
    color: palette.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  detailPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  detailTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  detailClose: {
    color: palette.textSecondary,
    fontSize: 20,
  },
  detailContent: {
    padding: spacing.md,
  },
  detailSection: {
    marginBottom: spacing.md,
  },
  detailSectionTitle: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  detailText: {
    color: palette.textPrimary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  timelineType: {
    fontSize: 16,
  },
  timelineText: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: 14,
  },
  detailActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  detailActionButton: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  detailActionButtonSecondary: {
    backgroundColor: "#2a2a2a",
  },
  detailActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
