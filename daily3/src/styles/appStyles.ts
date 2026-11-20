import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/tasks';

export const appStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
appBar: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appBarLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  appBarTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  screenContent: { padding: 16, paddingBottom: 32 },
  h1: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  h2: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 8 },
  h3: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  p: { fontSize: 14, color: COLORS.muted, lineHeight: 20 },
  subtitle: { fontSize: 14, color: COLORS.muted, marginBottom: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },

  button: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  chipText: { fontSize: 13, color: COLORS.text, fontWeight: '600' },

  label: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 16, marginBottom: 6 },
  labelSmall: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginTop: 10 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  inputMultiline: { minHeight: 90 },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  hint: { fontSize: 12, color: COLORS.muted, marginTop: 10 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  emptyBox: { padding: 24, alignItems: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 14, textAlign: 'center' },

  listHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#fff', fontWeight: '800', fontSize: 15 },
  taskTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  taskTitleDone: { textDecorationLine: 'line-through', color: COLORS.muted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  taskMetaText: { fontSize: 12, color: COLORS.muted },
  prioDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },

  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  versionKey: { color: COLORS.muted, fontSize: 14 },
  versionVal: { color: COLORS.text, fontSize: 14, fontWeight: '600' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  tabLabelActive: { color: COLORS.primary, fontWeight: '700' },
});