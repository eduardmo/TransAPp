import { Colors, Metrics } from '../../Themes/'

export default {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Metrics.navBarHeight,
    paddingTop: Metrics.smallMargin,
    paddingHorizontal: 5,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: 1
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: Colors.snow,
    marginTop: Metrics.section,
    backgroundColor: Colors.transparent,
    fontSize: 18
  },
  logo: {
    alignSelf: 'center',
    marginTop: Metrics.baseMargin,
    height: Metrics.icons.large,
    width: Metrics.icons.large
  },
  rightButtons: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  leftButtons: {
    flex: 1,
    paddingTop: Metrics.doubleBaseMargin + 3,
    paddingLeft: Metrics.smallMargin,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  }
}
